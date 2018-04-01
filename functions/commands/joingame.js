const lib = require('lib')({token: process.env.STDLIB_TOKEN});

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
    if(text){
        //lib.aidancrowther.pandermoniumBackend['@dev'](`room ${text}`);
        callback(null, {
          text: `<@${user}>, I have attempted to add you to the game with id: ${text}`,
          attachments: [
            // You can customize your messages with attachments.
            // See https://api.slack.com/docs/message-attachments for more info.
          ]
        });
    }else{
        callback(null, {
            text: `<@${user}, I have created a new game for you`
        })
    }

};
