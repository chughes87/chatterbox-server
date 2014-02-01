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
  var sql = 'INSERT INTO Rooms SET ?';// (roomName) VALUES (??)';
  var inserts = {roomName: roomName};
  sql = mysql.format(sql, inserts);
  connection.query(sql);
};

// exports.removeRoom = function(roomName){
//   var query = connection.query(
//     'DELETE FROM Rooms WHERE roomName = \''+
//       roomName+'\''
//   );
// };

exports.addUser = function(userName, roomName){
  roomName = roomName || 'main';
  var sql = 'INSERT INTO Users SET ?';//(userName, roomName) VALUES (??, ??)';
  var inserts = {userName: userName, roomName: roomName};
  sql = mysql.format(sql, inserts);
  connection.query(sql);
};

exports.getUserById = function(userId, cb){
  var sql = 'SELECT * FROM Users WHERE userId = ??';
  var inserts = [userId]
  sql = mysql.format(sql, inserts);
  connection.query(
    sql,
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
      console.log('getAllUsers results: '+JSON.stringify(results));
    }
  );
};

exports.addUserToRoom = function(userName, roomName){
  var sql = 'UPDATE Users SET roomName = ?? WHERE userName = ??';
  var inserts = [roomName, userName];
  sql = mysql.format(sql, inserts);
  connection.query(sql);
};

exports.getUserId = function(userName, cb){
  var sql = 'SELECT userId FROM Users WHERE userName = ??';
  var inserts = [userName];
  sql = mysql.format(sql, inserts);
  connection.query(
    sql,
    function(err, results){
      if(err) throw err;
      console.log('getUserId results:' + JSON.stringify(results));
      cb(results[0].userId);
    }
  );
};

exports.addMessage = function(userId, message, roomName){
  var sql = 'INSERT INTO Messages SET ?';//(userId, roomName, text) VALUES (??, ??, ??)';
  var inserts = {userId: userId, roomName: roomName, text: message};
  sql = mysql.format(sql, inserts);
  connection.query(sql);
};

exports.getAllRooms = function(cb){
  connection.query(
    'SELECT * FROM Rooms',
    function(err, results){
      if(err) throw err;
      cb(results);
      console.log('getAllRooms results: '+JSON.stringify(results));
    }
  );
};

exports.getAllMessagesInRoom = function(roomName, cb){
  var sql = 'SELECT * FROM Messages WHERE roomName = ??';
  var inserts = [roomName];
  sql = mysql.format(sql, inserts);
  connection.query(
    sql,
    function(err, results){
      if(err) throw err;
      console.log('getAllUsersInRoom: results: '+JSON.stringify(results));
      cb(results);
    }
  );
};