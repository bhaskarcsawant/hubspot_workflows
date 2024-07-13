'use strict';

const { MongoClient } = require('mongodb');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;
const OUTPUT_QUEUE_URL = process.env.OUTPUT_QUEUE_URL;

let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(MONGODB_DB);
  console.log('Connected to MongoDB');

  cachedDb = db;
  return db;
}

const buildQuery = (type, app, metaData) => {
  const query = { 'trigger.type': type };
  if (app) {
    query['trigger.app'] = app;
  }
  if (metaData) {
    query['trigger.metaData'] = metaData;
  }
  return query;
};

module.exports.triggerHandler = async (event) => {
  // Validate environment variables
  if (!MONGODB_URI || !MONGODB_DB || !OUTPUT_QUEUE_URL) {
    console.error('Missing environment variables');
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
      }),
    };
  }

  let db;
  try {
    db = await connectToDatabase(MONGODB_URI);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error connecting to MongoDB',
      }),
    };
  }

  for (const record of event.Records) {
    const { body } = record;
    console.log(`Received message: ${body}`);

    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (error) {
      console.error('Error parsing message body:', error);
      continue; // Skip to the next message
    }

    const { type, app, metaData, data } = parsedBody;

    let result;
    try {
      const collection = db.collection('workflows');
      const query = buildQuery(type, app, metaData);
      result = await collection.find(query).toArray();
    } catch (error) {
      console.error('Error querying MongoDB:', error);
      continue; // Skip to the next message
    }

    for (const workflow of result) {
      const MessageBody = {
        actions: workflow.actions,
        data: data,
      };
      console.log('Message to send:', MessageBody);

      const params = {
        QueueUrl: OUTPUT_QUEUE_URL,
        MessageBody: JSON.stringify(MessageBody),
      };

      try {
        await sqs.sendMessage(params).promise();
        console.log('Message sent to output queue');
      } catch (error) {
        console.error('Error sending message to output queue:', error);
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Messages processed and sent successfully',
    }),
  };
};
