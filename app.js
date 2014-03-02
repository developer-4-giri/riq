
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var timline = require('./routes/timeline');
var login = require('./routes/login');
var http = require('http');
var path = require('path');
var swig = require('swig');
var util = require('util');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//This is where all the magic happens!
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//Swig will cache templates for you, but you can disable
//that and use Express's caching instead, if you like:
//app.set('view cache', false);
//To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
//NOTE: You should always cache templates in a production environment.
//Don't leave both of these to `false` in production!

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.post('/login', login.login, function(req, res){
    var userName = req.params.userName;
    console.log('%s %s %s', req.method, req.url, userName);
});

app.get('/timeline', isAuthenticated, logTheRequest, timline.drawtimeline);

function isAuthenticated(req,res,next){
    console.log("Request Recieved, Authentication Checks here : Decide how to Autheticate");
    next();
}

function logTheRequest(req,res,next){
	console.log("Request Recieved : { Headers :" + util.inspect(req.headers, { showHidden: false }).replace(/\n/g, " ")
			+ "}, { Url:" + util.inspect(req.url, { showHidden: false, depth:1 })
			+ "}, { Method :" + util.inspect(req.method, { showHidden: false, depth:1 })
			+ "}, { HttpVersionMajor :" + util.inspect(req.httpVersionMajor, { showHidden: false, depth:1 })
			+ "}, { HttpVersionMinor :" + util.inspect(req.httpVersionMinor, { showHidden: false, depth:1 })
			+ "}, { Query :" + util.inspect(req.query, { showHidden: false }).replace(/\n/g, " ")
			+ "}, { StartTime :" + util.inspect(req._startTime, { showHidden: false, depth:1 })
			+ "}, { RemoteAddress :" + util.inspect(req._remoteAddress, { showHidden: false, depth:1 })
			+ "}, { Route :" + util.inspect(req.route, { showHidden: false }).replace(/\n/g, " ")
			+ "}, { Body :" + util.inspect(req.body, { showHidden: false }).replace(/\n/g, " ") +"  }. ");
	next();
}

function censor(censor) {
	  var i = 0;

	  return function(key, value) {
	    if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
	      return '[Circular]'; 

	    if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
	      return '[Unknown]';

	    ++i; // so we know we aren't using the original object anymore

	    return value;  
	  }
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
