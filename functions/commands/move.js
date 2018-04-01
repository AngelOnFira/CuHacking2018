const lib = require('lib')({token: process.env.STDLIB_TOKEN});
const backend = require(../backend/backend.js);

/**
* /hello
*
*   Basic "Hello World" command.
*   All Commands use this template, simply create additional files with
*   different names to add commands.
*
*   See https://api.slack.com/slash-commands for more details.
*
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {object} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/


module.exports = (user, channel, text = '', command = {}, botToken = null, callback) => {
    var dbRequest = {};
    dbRequest.command = "action";
    dbRequest.action = text;
    dbRequest.user = user;
    dbRequest.botToken = botToken;
    dbRequest.channel = channel;
    backend(JSON.stringify(dbRequest));
  callback(null, {
    text: `<@${display_name}>, My understanding is that you want to: ${text}`,
    attachments: [
      // You can customize your messages with attachments.
      // See https://api.slack.com/docs/message-attachments for more info.
    ]
  });
};
