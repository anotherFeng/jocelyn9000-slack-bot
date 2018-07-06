const RtmClient = require('@slack/client').RtmClient;
const WebClient = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const dotenv = require('dotenv').config();

const bot_token = process.env.BOT_USER_TOKEN;
const rtm = new RtmClient(bot_token);
const web = new WebClient(bot_token);

const allCommands = ['issue', 'command2'];

let users = [];

const updateUsers = data => {
    users = data.members;
}

const getUsernameFromId = id => {
    const user = users.find(user => user.id === id);
    return user ? user.name : 'unknown member';
}

const executeCommand = (command, args) => {
    console.log(command, args); 
}

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  if (message.type === 'message' && message.text) {
      if (message.text.indexOf(':') !== -1) {
          allCommands.forEach((command) => {
              if (message.text.indexOf(command) === 0) {
                  const args = message.text.substring(command.length);
                  executeCommand(command, args);
              }
          });
      }
  }
});

web.users.list((err, data) => {
  if (err) {
      console.error('web.users.list Error:', err);
  } else {
      updateUsers(data);
  }
});

rtm.start();

