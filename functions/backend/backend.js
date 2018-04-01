var MongoConn = require('mongodb').MongoClient;

const dbURL = 'mongodb://admin:carleton@cuhacking-shard-00-00-omz4n.mongodb.net:27017,cuhacking-shard-00-01-omz4n.mongodb.net:27017,cuhacking-shard-00-02-omz4n.mongodb.net:27017/test?ssl=true&replicaSet=cuhacking-shard-0&authSource=admin';
var db;
var client;
const dataBase = 'cuhacking';

const timeout = 2000;
const start = Date.now();
var connected = false;
var status = "";

MongoConn.connect(dbURL, function(err, database){
  if(err) status = "Unable to establish database connection";
  else{
    client = database;
    db = client.db(dataBase);
  }

  connected = true;
});

module.exports = (input = 'default', context, callback) => {

  while(!connected && (Date.now() < (start+timeout))){};

  if(status){
    callback(status, "");
    return;
  }

  if(!connected){
    callback("Connection timed out", null);
    return;
  }

  var command = input.toLowerCase().split(" ");

  switch(command[0]){

    case("room"):
      callback(null, "Get room #"+command[1]);
    break;

    case("newroom"):
      callback(null, "Add room");
    break;

    case("get"):
      /*db.listCollections().toArray(function(err, collInfos) {
      // collInfos is an array of collection info objects that look like:
      // { name: 'test', options: {} }
        callback(null, collInfos);
      });
      db.collection('startup_log').find({}).toArray(function(err, items){
        if(err) callback(null, "Internal server error");
        else callback(null, items);
      });*/
      var cursor = db.collection('story').find({}).sort({index:-1});
      var response;

      cursor.forEach(
          function(doc){
             if(doc['index'] == command[1]){
                 response = doc;
             }
          },function(err){
              if(err) callback("Internal server error", null);
              else {
                  if (response != null) {
                      callback(null, response);
                  }
                  else {
                      callback("Not found", null);
                  }
              }
          }
      );
    break;

    default:
      callback("Invalid command", null);
    break;

  }

  client.close;

};
