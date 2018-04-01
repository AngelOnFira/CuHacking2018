//Mongo Clinet connection
var MongoConn = require('mongodb').MongoClient;

//Database information
const dbURL = 'mongodb://admin:carleton@cuhacking-shard-00-00-omz4n.mongodb.net:27017,cuhacking-shard-00-01-omz4n.mongodb.net:27017,cuhacking-shard-00-02-omz4n.mongodb.net:27017/test?ssl=true&replicaSet=cuhacking-shard-0&authSource=admin';
var db;
var client;
const dataBase = 'cuhacking';

//Local values for runtime
const timeout = 5000;
const start = Date.now();
var connected = false;
var status = "";

//Initialize connection to database
MongoConn.connect(dbURL, function(err, database){
  //On error, report database error
  if(err) status = "Unable to establish database connection";
  //Otherwise update database variables
  else{
    client = database;
    db = client.db(dataBase);
  }

  //Stop waiting on Async
  connected = true;
});

//Define module, taking a large string as input
module.exports = (input = '', context, callback) => {

  var query = {};

  //Wait until DB connection is established, or times out
  while(!connected && (Date.now() < (start+timeout))){};

  //If the connection timed out, report a time out
  if(!connected){
    callback("Connection timed out", null);
    return;
  }

  //Report an async failure status
  if(status){
    callback(status, "");
    return;
  }

  //Attempt to parse the query
  try {
        query = JSON.parse(input);
    } catch(e) {
        callback("Malformed request", null);
    }

  //Switch on main command hook
  switch(query['command']){

    //Get database element by index
    case("get"):
      fetchFromDB('story', 'index', query['index'], callback);
    break;

    case("joingame"):
      writeToDB('rooms', query['data'], callback);
    break;

    //Default to report invalid hook
    default:
      callback("Invalid command", null);
    break;

  }

  //Close DB connection on exit
  client.close;

};

function fetchFromDB(collection, param, identifier, callback){
  //Define DB cursor
      var cursor = db.collection(collection).find({}).sort({param:-1});
      var response;

      //Iterate over each entry in the collection
      cursor.forEach(
          function(doc){
              //If the index matches, return the given JSON entry
              if(doc[param] == identifier){
                //Set response to the parsed JSON object
                response = JSON.parse(JSON.stringify(doc));
             }
          },function(err){
              //On error, return a server error
              if(err) callback("Internal server error", null);
              //Otherwise return reponse based on located value
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
}

function writeToDB(coll, data, callback){
    //Add/update the data
  var collection = db.collection(coll);
  collection.update({hello: data.hello}, data, {upsert: true}, function(err, result){
    //If an error is encountered, respond with database error
    if(err) callback("Internal server error: "+err, null);
    else callback(null, "added");
  });
}

function generateRoom(){

}

/*
function getRoomId() {
    var pass = false;
    while (!pass ){

        var num = Math.floor(Math.random() * 8999+1000);

        if (!(num in dict)) {
            pass = true;
            dict[num] = dict[num] || [];
            dict[num].push(true);
        }

    }
    return num;
}

 function interpretResponse( userResponse, storyIndex){
    var storyResponses = story[storyIndex].responses;

     for (var res in storyResponses) {
         console.log(res);
         console.log(storyResponses[res]['response']);

        if (storyResponses[res]['response'] == userResponse) {
            return storyResponses[res]['goto'];
        }
     }
     //Return an error
     return -1;
 }
 */