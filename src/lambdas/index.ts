import { SQS } from 'aws-sdk';
import { MongoClient } from 'mongodb';
import { SQSEvent, Context } from 'aws-lambda';

const sqs = new SQS();

const MONGODB_URI = process.env.MONGO_URI!;
const INPUT_QUEUE_URL = process.env.AWS_SQS_URL!;
const OUTPUT_QUEUE_URL = process.env.AWS_SQS_ACTIONS_URL!;

let cachedDb: MongoClient | null = null;

async function connectToDatabase(uri: string): Promise<MongoClient> {
    if (cachedDb) {
        return cachedDb;
    }

    const client = await MongoClient.connect(uri, {});
    cachedDb = client;
    return client;
}

async function fetchMessageFromQueue(): Promise<SQS.Message | null> {
    const params = {
        QueueUrl: INPUT_QUEUE_URL,
        MaxNumberOfMessages: 1
    };

    const result = await sqs.receiveMessage(params).promise();
    if (result.Messages && result.Messages.length > 0) {
        return result.Messages[0];
    } else {
        return null;
    }
}

async function queryDatabase(client: MongoClient, query: object): Promise<any> {
    const db = client.db('workflow'); // Replace with your database name
    const collection = db.collection('workflows'); // Replace with your collection name
    const result = await collection.find(query);
    return result;
}

async function sendMessageToQueue(messageBody: any): Promise<void> {
    const params = {
        QueueUrl: OUTPUT_QUEUE_URL,
        MessageBody: JSON.stringify(messageBody)
    };

    await sqs.sendMessage(params).promise();
}

export const handler = async (event: SQSEvent, context: Context): Promise<void> => {
    try {
        const client = await connectToDatabase(MONGODB_URI);

        const message = await fetchMessageFromQueue();
        if (message) {
            //@ts-ignore
            const body = JSON.parse(message.Body);
            // const query = { _id: body._id }; // Adjust the query based on your requirements

            // const dbResult = await queryDatabase(client, query);
            console.log('Processing message:', body);
            // await sendMessageToQueue(dbResult);

            // Delete the message from the input queue after processing
            // const deleteParams = {
            //     QueueUrl: INPUT_QUEUE_URL,
            //     ReceiptHandle: message.ReceiptHandle
            // };
            // await sqs.deleteMessage(deleteParams).promise();
        }
    } catch (error) {
        console.error(error);
    }
};

