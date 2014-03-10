
/**
 * Module dependencies.
 */

var express = require('express'), 
	routes = require('./routes'),
	timline = require('./routes/timeline'),
	login = require('./routes/login'),
	path = require('path'),
	swig = require('swig'),
	util = require('util'),
	rest = require('./rest.js'),
	oauth = require('./oauth.js'),
	passport = require('passport'),
	ForceDotComStrategy = require('passport-forcedotcom').Strategy;

// all environments
var port = process.env.PORT || 3000; 

var CF_CLIENT_ID = '3MVG9A2kN3Bn17huFN0b_0IIMm64dpwfNyetlmBv0GQj0cmT49ZyKvvbmf07a16hY.e8TOIwoRR5aPr46eELb';
var CF_CLIENT_SECRET = '5288898514549948088';
var CF_CALLBACK_URL = 'http://localhost:' + port + '/auth/tiqconnect/callback';
var SF_AUTHORIZE_URL = 'https://login.salesforce.com/services/oauth2/authorize';
var SF_TOKEN_URL = 'https://login.salesforce.com/services/oauth2/token';

//Passport session setup.
//To support persistent login sessions, Passport needs to be able to
//serialize users into and deserialize users out of the session.  Typically,
//this will be as simple as storing the user ID when serializing, and finding
//the user by ID when deserializing.  However, since this example does not
//have a database of user records, the complete Salesforce profile is
//serialized and deserialized.
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});


//Use the ForceDotComStrategy within Passport.
//Strategies in Passport require a `verify` function, which accept
//credentials (in this case, an accessToken, refreshToken, and Salesforce
//profile), and invoke a callback with a user object.
var sfStrategy = new ForceDotComStrategy({
		clientID: CF_CLIENT_ID,
		clientSecret: CF_CLIENT_SECRET,
		callbackURL: CF_CALLBACK_URL,
		authorizationURL: SF_AUTHORIZE_URL,
		tokenURL: SF_TOKEN_URL
	}, 
	function(accessToken, refreshToken, profile, done) {
		// asynchronous verification, for effect...
		process.nextTick(function() {
		
			// To keep the example simple, the user's forcedotcom profile is returned to
			// represent the logged-in user.  In a typical application, you would want
			// to associate the forcedotcom account with a user record in your database,
			// and return that user instead.
			//
			// We'll remove the raw profile data here to save space in the session store:
			delete profile._raw;
			return done(null, profile);
		});
});

passport.use(sfStrategy);

/**
 * Create the server and configure it
 */
var app = express();
app.set('title', 'Timeline IQ');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.engine('html', swig.renderFile);

app.use(express.logger());
app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.cookieParser(CF_CLIENT_SECRET));

app.use(express.session({
    secret: 'keyboard cat'
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});
	
app.get('/', function(req, res) {
  console.log(req.user);
  if(!req.user) {
    req.session.destroy();
    req.logout();
    return res.redirect('/login');
  }

  res.redirect('/timeline');

});

// GET /auth/forcedotcom
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Force.com authentication will involve
//   redirecting the user to your domain.  After authorization, Force.com will
//   redirect the user back to this application at /auth/forcedotcom/callback
app.get('/auth/tiqconnect', passport.authenticate('forcedotcom'), function(req, res) {
  // The request will be redirected to Force.com for authentication, so this
  // function will not be called.
});

// GET /auth/forcedotcom/callback
//   PS: This MUST match what you gave as 'callback_url' earlier
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/tiqconnect/callback', passport.authenticate('forcedotcom', {
  failureRedirect: '/login'
}), function(req, res) {
  res.redirect('/');
});

app.get('/logout', function(req, res) { 
  res.redirect('/login');
});
	
app.get('/login', logTheRequest, routes.index);
	
app.get('/timeline', ensureAuthenticated, logTheRequest, timline.drawtimeline);

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

function ensureAuthenticated(req, res, next) {
	  if(req.isAuthenticated()) {
	    return next();
	  }
	  res.redirect('/login');
}


app.listen(port, function(){
	  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});