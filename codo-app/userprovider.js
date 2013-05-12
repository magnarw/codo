var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

UserProvider = function(host, port) {
  this.db= new Db('node-mongo-codo', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


UserProvider.prototype.getCollection= function(callback) {
  this.db.collection('users', function(error, user_collection) {
    if( error ) callback(error);
    else callback(null, user_collection);
  });
};

//find all employees
UserProvider.prototype.find = function(userName, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        user_collection.find({"username":userName}).toArray(function(error, results) {
          console.log(results);
          if( error ) callback(error);
          else callback(null, results);
        });
      }
    });
};

//save new employee
UserProvider.prototype.save = function(user, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        console.log(user);
        user_collection.insert(user, function() {
          callback(null, user);
        });
      }
    });
};

exports.UserProvider = UserProvider;