var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

CodoProvider = function(host, port) {
  this.db= new Db('node-mongo-codo', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

//get codolist collection
CodoProvider.prototype.getCollection= function(callback) {
  this.db.collection('codolists', function(error, codolist_collection) {
    if( error ) callback(error);
    else callback(null, codolist_collection);
  });
};

//find all employees
CodoProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, codolist_collection) {
      if( error ) callback(error)
      else {
        codolist_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save new employee
CodoProvider.prototype.save = function(lists, callback) {
    this.getCollection(function(error, codolist_collection) {
      if( error ) callback(error)
      else {
        if( typeof(lists.length)=="undefined")
          list = [lists];

        for( var i =0;i< lists.length;i++ ) {
          list = lists[i];
          list.created_at = new Date();
        }

        codolist_collection.insert(lists, function() {
          callback(null, lists);
        });
      }
    });
};

exports.CodoProvider = CodoProvider;