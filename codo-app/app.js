
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , UserProvider = require('./userprovider').UserProvider
  , CodoProvider = require('./codoprovider').CodoProvider;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


var codoProvider= new CodoProvider('localhost', 27017);
var userProvider = new UserProvider('localhost',27017);


//Routes
app.get('/', function(req, res){
  codoProvider.findAll(function(error, lists){
      res.render('index', {
            title: 'CODOLists',
            codolists:lists
        });
  });
});

app.get('/new', function(req, res) {
	codoProvider.findAll(function(error, lists){
      res.render('codolist_new.jade', {
            title: 'CODOLists',
            codolists:lists
        });
  	});
});

//save new employee
app.post('/new', function(req, res){
    codoProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});

//login 
app.post('/login', function (req, res) {
  var post = req.body;
  if (post.user == 'john' && post.password == 'johnspassword') {
    req.session.user_id = johns_user_id_here;
    res.redirect('/my_secret_page');
  } else {
    res.send('Bad user/pass');
  }
});


//auth utils 
function checkAuth(req, res, next) {
  if (!req.session.user_id) {
     res.redirect('/');
  } else {
    next();
  }
}


app.listen(3000);