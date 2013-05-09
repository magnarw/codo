
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , mongo = require('mongodb');

var app = express(),
	db = new mongo.Db('codo', new mongo.Server('localhost', 27017)),
	codoList = db.collection("codolist");

app.configure(function(){
	app.use(express.bodyParser());	
});

app.get('/', function(req, res){
  codoList.find().toArray(function (err, docs) {
  	if (err) throw err;
  	res.render("index.jade", { codoList: docs });
  });
 });

http.createServer(app).listen(3000);