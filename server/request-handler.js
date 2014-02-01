var _storage = [];
// var logFile = "./log.txt";
var fs = require('fs');
var url = require('url');
var db = require('./database');

exports.loadMessages = function(){
  // fs.readFile(logFile, {encoding: 'utf8'}, function(err,data){
  //   if(err) throw err;
  //   console.log(data);
  // });
};

exports.handleRequest = function(request, response) {
  var statusCode = 200;
  var requestJSON = url.parse(request.url,true,true);
  if(requestJSON.pathname.match(/\/classes\//) === null){
    statusCode = 404;
  }else if(request.method === "POST") {
    statusCode = 201;
    request.on('data', function(data){
      postDataToDatabase(JSON.parse(data));
      // var ws = fs.createWriteStream(logFile,{flags:'w'});
      // _storage.push(JSON.parse(data));
      // ws.write(data);
    });
  }else if(request.method === "GET") {
    statusCode = 200;
  }
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";
  response.writeHead(statusCode, headers);
  response.end(new Buffer(JSON.stringify(_storage)));
};

var postDataToDatabase = function(data){
  db.getAllUsers(function(users){
    for (var i = 0; i < users.length; i++) {
      if(users[i].userName === data.username){
        var user = users[i];
        db.addMessage(user.userId, data.text, user.roomName);
      } else {
        db.addUser(data.username, data.roomName);
        db.getUserId(data.username, function(userId){
          db.addMessage(userId, data.text, data.roomName);
        });
      }
    }
  });
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
