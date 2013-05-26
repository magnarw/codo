
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , UserProvider = require('./userprovider').UserProvider
  , CodoProvider = require('./codoprovider').CodoProvider

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
 
  app.use(express.static(path.join(__dirname, 'public')));

 // app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.bodyParser());
  app.use(express.cookieParser('shhhh, very secret'));
  app.use(express.session());
   app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


var codoProvider= new CodoProvider('localhost', 27017);
var userProvider = new UserProvider('localhost',27017);


//Routes
app.get('/', checkAuth, function(req, res){
  console.log("dette er session: " + req.session);
  var userId = req.session.user_id 
  res.redirect('/user/' + userId);
});

app.get('/login', function(req,res){
  res.render("landing.jade");
})



app.get('/user/:userId', checkAuth,function(req, res){
  res.render("index.jade");
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
  userProvider.find(post.user, function (error, user){
    console.log("Dette er bruker:" + user.username);
    var userObject = user[0];
    console.log("Dette er userobject:" + userObject);
    if(userObject.password == post.password){
      // Regenerate session when signing in
      // to prevent fixation 
      req.session.regenerate(function(){
        // Store the user's primary key 
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = userObject._id;
        req.session.user_id = userObject._id;
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('/');
      });
    }else {
        res.send('Bad user/pass');
    }})
});


//signup 
app.post('/signup', function (req, res) {
  var post = req.body;
  console.log("dette er brukernavn" + post.newuser);
  var newUser = {"username":post.newuser, "password":post.newpassword}; 
  console.log("Dette er bruker:" + newUser.username);
  userProvider.save(newUser, function( error, docs) {
        res.redirect('/')
    });
});


//auth utils 
function checkAuth(req, res, next) {
  if (req.session === undefined || !req.session.user) {
     res.redirect('/login');
  } else {
    next();
  }
}


app.listen(3000);