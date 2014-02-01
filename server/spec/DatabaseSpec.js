var mysql = require('mysql');
var database = require('../database.js');

describe('SQL Persistence', function(){
  beforeEach(function(done){
    database.clearDatabase();
    done();
  });
  it('Should addRoom to room list', function(done){
    database.addRoom('testRoom');
    database.getAllRooms(function(roomList){
      var roomName = roomList[0].roomName;
      expect(roomName).toEqual('testRoom');
      done();
    });
  });
  it('Should addUser to user list', function(done){
    database.addUser('testUser');
    database.getAllUsers(function(usersList){
      var userName = usersList[0].userName;
      expect(userName).toEqual('testUser');
      done();
    });
  });
  it('Should get userID', function(done){
    database.addUser('testUser');
    database.getUserId('testUser', function(id){
      expect(typeof id).toEqual('number');
      done();
    });
  });
  it('Should add user to room', function(done){
    database.addUser('testUser');
    database.addRoom('testRoom');
    database.addUserToRoom('testUser', 'testRoom');
    database.getUserId('testUser', function(id){
      database.getUserById(id, function(user){
        console.log("addUser user: "+JSON.stringify(user));
        expect(user.roomName).toEqual('testRoom');
        done();
      });
    });
  });
  it('Should add message', function(done){
    database.addUser('testUser', 'testRoom');
    database.getUserId('testUser', function(userId){
      database.addMessage(userId, 'testMessage', 'testRoom');
      database.getAllMessagesInRoom('testRoom', function(messages){
        expect(messages[0].userId).toEqual(userId);
        expect(messages[0].roomName).toEqual('testRoom');
        expect(messages[0].text).toEqual('testMessage');
        done();
      });
    });
  });

  it('Should get all rooms', function(done){
    database.addRoom("test1");
    database.addRoom("test2");
    database.addRoom("test3");
    database.getAllRooms(function(rooms){
      expect(rooms[0].roomName).toEqual('test1');
      expect(rooms[1].roomName).toEqual('test2');
      expect(rooms[2].roomName).toEqual('test3');
      done();
    });
  });

  it('Should get all messages in room', function(done){
    database.addUser('testUser', 'testRoom');
    database.getUserId('testUser', function(userId){
      database.addMessage(userId, 'test1', 'testRoom');
      database.addMessage(userId, 'test2', 'testRoom');
      database.addMessage(userId, 'test3', 'testRoom');
      database.getAllMessagesInRoom('testRoom', function(messages){
        expect(messages[0].text).toEqual('test1');
        expect(messages[1].text).toEqual('test2');
        expect(messages[2].text).toEqual('test3');
        done();
      });
    });
  });
  database.clearDatabase();
});
