'use strict';
const axios = require('axios');


const API_SERVER_URL = process.env.API_SERVER_URL;


const handleMessage = async (type, data) => {
  try {
    switch (type) {
      case 'send_message':
        const messageBody = {
          from: 'workflow',
          message: JSON.stringify(data),
        };
        await axios.post(`${API_SERVER_URL}/api/v1/send_message`, messageBody);
        console.log('Message sent successfully');
        break;
      default:
        console.log('Unknown type:', type);
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
};

const performAction = async (action, data) => {
  const { type, app } = action;
  switch (app) {
    case 'messaging':
      await handleMessage(type, data);
      break;
    default:
      console.log('Unknown app:', app);
  }
};

module.exports.actionsHandler = async (event) => {
  for (const record of event.Records) {
    const { body } = record;

    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (error) {
      console.error('Error parsing message body:', error);
      continue; // Skip to the next record
    }

    const { actions, data } = parsedBody;
    for (const action of actions) {
      console.log('Performing action:', action, data);
      try {
        await performAction(action, data);
        console.log('Action performed successfully');
      } catch (error) {
        console.error('Error performing action:', error);
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
