const lib = require('lib')({token: process.env.STDLIB_TOKEN});
//const backend = require('../backend/backend.js');

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
    dbRequest.command = "joinroom";
    //dbRequest.room = text;
    dbRequest.data = {};
    dbRequest.data.user = user;
    dbRequest.data.botToken = botToken;
    dbRequest.data.channel = channel;
    /*if(text){
        let temp = JSON.stringify(dbRequest);
        lib.pandermonium.pandermoniumSlack.backend(JSON.stringify(dbRequest));
        callback(null, {
          text: `<@${user}>, I am attempting to add you to the game with id: ${text}\n${temp}`,
          attachments: [
            // You can customize your messages with attachments.
            // See https://api.slack.com/docs/message-attachments for more info.
          ]
        });
    }else{*/
        //Forest Testing stuff
        //var response = await lib.aidancrowther.pandermoniumBackend['@dev'](`newroom`);
        let temp = JSON.stringify(dbRequest);
        //lib.pandermonium.pandermoniumSlack['@dev'].backend.backend(JSON.stringify(dbRequest));
        return lib.pandermonium.pandermoniumSlack['@dev'].backend.backend(temp, (err) => {
            if(err) callback(err, null);
            else callback(null, "Command received");
        });
        /*callback(null, {
            text: `<@${user}>, I am attempting to create a new game for you\n${temp}`,
            attachments: [
              // You can customize your messages with attachments.
              // See https://api.slack.com/docs/message-attachments for more info.
            ]
        });*/
    //}

};
