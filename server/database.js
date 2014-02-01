var mysql = require('mysql');

var connection = mysql.createConnection({
      user: "root",
      password: "rayma",
      database: "chat"
    });

connection.connect();

exports.clearDatabase = function(){
    connection.query('DELETE FROM Rooms');
    connection.query('DELETE FROM Messages');
    connection.query('DELETE FROM Users');
};

exports.addRoom = function(roomName){
  connection.query(
    'INSERT INTO Rooms (roomName) VALUES (\''+
      roomName+'\')'
  );
};

// exports.removeRoom = function(roomName){
//   var query = connection.query(
//     'DELETE FROM Rooms WHERE roomName = \''+
//       roomName+'\''
//   );
// };

exports.addUser = function(userName, roomName){
  roomName = roomName || 'main';
  connection.query(
    'INSERT INTO Users (userName, roomName) VALUES (\''+
    userName+'\',\''+roomName+'\')');
};

exports.getUserById = function(userId, cb){
  connection.query(
    'SELECT * FROM Users WHERE userId = \''+userId+'\'',
    function(err, results){
      if(err) throw err;
      cb(results[0]);
    }
  );
};

// exports.removeUser = function(userName){
//   var query = connection.query(
//     'DELETE FROM Users WHERE userName = \''+
//       userName+'\''
//   );
// };

exports.getAllUsers = function(cb){
  connection.query(
    'SELECT * FROM Users',
    function(err, results){
      if(err) throw err;
      cb(results);
      // console.log('getAllUsers results: '+JSON.stringify(results));
    }
  );
};

exports.addUserToRoom = function(userName, roomName){
  var sql = 'UPDATE Users SET roomName = \''+roomName+'\'WHERE userName = \''+userName+'\'';
  connection.query(sql);
};

exports.getUserId = function(userName, cb){
  connection.query(
    'SELECT userId FROM Users WHERE userName = \''+userName+'\'',
    function(err, results){
      if(err) throw err;
      // console.log('getUserId results:' + JSON.stringify(results));
      cb(results[0].userId);
    }
  );
};

exports.addMessage = function(userId, message, roomName){
  connection.query(
    'INSERT INTO Messages (userId, roomName, text) VALUES (\''+
    userId+'\',\''+roomName+'\',\''+message+'\')');
};

exports.getAllRooms = function(cb){
  connection.query(
    'SELECT * FROM Rooms',
    function(err, results){
      if(err) throw err;
      cb(results);
      // console.log('getAllRooms results: '+JSON.stringify(results));
    }
  );
};

exports.getAllMessagesInRoom = function(roomName, cb){
  connection.query(
    'SELECT * FROM Messages WHERE roomName = \''+roomName+'\'',
    function(err, results){
      if(err) throw err;
      // console.log('getAllUsersInRoom: results: '+JSON.stringify(results));
      cb(results);
    }
  );
};