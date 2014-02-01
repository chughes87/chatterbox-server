var fs = require('fs');
var url = require('url');
var Q = require('q');
var db = require('./database');

exports.handleRequest = function(request, response) {
  var statusCode = 200;
  var requestJSON = url.parse(request.url,true,true);
  if(requestJSON.pathname.match(/\/classes\//) === null){
    statusCode = 404;
  }
  request.on('data', function(data){
    if(request.method === "POST") {
      statusCode = 201;
      postDataToDatabase(JSON.parse(data));
      console.log(JSON.parse(data), "Data from POST");
    } else {
      statusCode = 200;
    }
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "application/json";
    response.writeHead(statusCode, headers);
    getDataFromDatabase(data.roomName,function(returnData){
      response.end(new Buffer(returnData));
    });
  });
};

var getDataFromDatabase = function(roomName, cb){
  var returnData = {};
  db.getAllMessagesInRoom(roomName, function(messages){
    returnData.messages = messages;
    db.getAllRooms(function(rooms){
      returnData.rooms = rooms;
      console.log(returnData, "Return Data from POST");
      cb(returnData);
    });
  });
};

var roomExists = function(rooms, roomName){
  var exists = false;
  for (var i = 0; i < rooms.length; i++) {
    if(roomName === rooms[i]){
      exists = true;
    }
  }
  return exists;
};

var postDataToDatabase = function(data){
  db.getAllUsers(function(users){
      // console.log(users[i].userName, "user name from DB");
    var userExists = false;
    for (var i = 0; i < users.length; i++) {
      if(users[i].userName === data.username){
        userExists = true;
        break;
      }
    }
    if(!userExists){
      db.addUser(data.username, data.roomname);
    }
      db.getAllRooms(function(rooms){
        if(!roomExists(rooms, data.roomname)){
          db.addRoom(data.roomName);
        }
        db.getUserId(data.username, function(userId){
          db.addMessage(userId, data.text, data.roomName);
        });
      });
    }
  });
};


var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
