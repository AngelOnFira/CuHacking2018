//Mongo Clinet connection
var MongoConn = require('mongodb').MongoClient;
var crypto = require('crypto');

//Database information
const dbURL = 'mongodb://admin:carleton@cuhacking-shard-00-00-omz4n.mongodb.net:27017,cuhacking-shard-00-01-omz4n.mongodb.net:27017,cuhacking-shard-00-02-omz4n.mongodb.net:27017/test?ssl=true&replicaSet=cuhacking-shard-0&authSource=admin';
var db;
var client;
const dataBase = 'cuhacking';

//Local values for runtime
const timeout = 20000;
const start = Date.now();
var connected = false;
var status = "";

//Define module, taking a large string as input
module.exports = (input = '', context, callback) => {

  console.log(input);

  var query = {};

  //Attempt to parse the query
  try {
    query = JSON.parse(input);
  } catch (e) {
    console.log("malformed");
    callback("Malformed request", null);
  }

  console.log("JSON okay");

  //Switch on main command hook
  switch (query['command']) {

    //Get database element by index
    case ("get"):
      fetchFromDB(query['collection'], query['param'], query['identifier'], callback);
      break;

    case ("action"):
      runAction(query['action'], query['data'], callback);
      break;

    case ("joinroom"):
      generateRoom(query['data'], callback);
      callback("Command received", null);
      break;

      //Default to report invalid hook
    default:
      callback("Invalid command", null);
      break;

  }

};

function fetchFromDB(collection, param, identifier, callback) {

  //Initialize connection to database
  MongoConn.connect(dbURL, function(err, database) {
    //On error, report database error
    if (err) status = "Unable to establish database connection";
    //Otherwise update database variables
    else {
      client = database;
      db = client.db(dataBase);
    }


    //Define DB cursor
    var cursor = db.collection(collection).find({}).sort({
      param: -1
    });
    var response;

    //Iterate over each entry in the collection
    cursor.forEach(
      function(doc) {
        //If the index matches, return the given JSON entry
        if (doc[param] == identifier) {
          //Set response to the parsed JSON object
          response = JSON.parse(JSON.stringify(doc));
        }
      },
      function(err) {
        //On error, return a server error
        if (err) callback("Internal server error", null);
        //Otherwise return reponse based on located value
        else {
          if (response != null) {
            callback(null, response);
          } else {
            callback("Not found", null);
          }
        }
      }
    );

    //Close DB connection on exit
    client.close;
  });
}

function writeToDB(coll, data, param, callback) {

  //Initialize connection to database
  MongoConn.connect(dbURL, function(err, database) {
    //On error, report database error
    if (err) status = "Unable to establish database connection";
    //Otherwise update database variables
    else {
      client = database;
      db = client.db(dataBase);
    }

    //Add/update the data
    var collection = db.collection(coll);
    collection.update({
      param: data.param
    }, data, {
      upsert: true
    }, function(err, result) {
      //If an error is encountered, respond with database error
      if (err) callback("Internal server error: " + err, null);
      else callback(null, "added");
    });

    //Close DB connection on exit
    client.close;
  });

}

//Create a new room using the given user data
function generateRoom(data, callback) {
  //Initialize variables
  var unique = false;
  var id;
  var check;

  //Begin generating room object
  var room = {};
  room['userData'] = data;
  room['index'] = 0;

  //Generate a unique user id
  //while(!unique){
  id = crypto.randomBytes(20).toString('hex');
  //check = fetchFromDB('rooms', 'roomId', id);
  //unique = (check == null);
  //}

  //Finalize room object and return status
  room['roomId'] = id;
  writeToDB('rooms', room, 'roomId', callback);

  addUser(room['userData']['user'], id, callback);

}

function addUser(userId, roomId, callback) {
  var user = {};
  user[userId] = roomId;

  var success = writeToDB('userlist', user, 'user', callback);

}

function runAction(action, user, callback) {
  //Initialize connection to database
  MongoConn.connect(dbURL, function(err, database) {
    //On error, report database error
    if (err) status = "Unable to establish database connection";
    //Otherwise update database variables
    else {
      client = database;
      db = client.db(dataBase);
    }
    //Define DB cursor
    var cursor = db.collection('rooms').find({}).sort({
      "id": -1
    });
    var response;
    //Iterate over each entry in the collection
    cursor.forEach(
      function(doc) {
        //If the index matches, return the given JSON entry
        if (doc['userData']['user'] == user['user']) {
          //Set response to the parsed JSON object
          response = JSON.parse(JSON.stringify(doc));
        }
      },
      function(err) {
        //On error, return a server error
        if (err) callback("Internal server error", null);
        //Otherwise return reponse based on located value
        else {
          if (response != null) {
            MongoConn.connect(dbURL, function(err, database) {
              //On error, report database error
              if (err) status = "Unable to establish database connection";
              //Otherwise update database variables
              else {
                client = database;
                db = client.db(dataBase);
              }
              //Define DB cursor
              var cursor = db.collection('story').find({}).sort({
                "id": -1
              });
              var result;

              //Iterate over each entry in the collection
              cursor.forEach(
                function(doc) {
                  //If the index matches, return the given JSON entry
                  if (doc['index'] == response['index']) {
                    //Set response to the parsed JSON object
                    result = JSON.parse(JSON.stringify(doc));
                  }
                },
                function(err) {
                  //On error, return a server error
                  if (err) callback("Internal server error", null);
                  //Otherwise return reponse based on located value
                  else {
                    if (result != null) {


                      console.log(result['storyText']);


                      callback(null, result);
                    } else {
                      callback("Error", null);
                    }
                  }
                }
              );
              //Close DB connection on exit
              client.close;
            });
            callback(null, response);
          } else {
            callback("Error", null);
          }
        }
      }
    );
    //Close DB connection on exit
    client.close;
  });
}