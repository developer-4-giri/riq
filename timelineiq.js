var nforce = require('nforce'),
	express = require('express'), 
	routes = require('./routes'),
	account = require('./routes/account'),
	usermanagment = require('./routes/usermanagment'),
	path = require('path'),
	swig = require('swig'),
	util = require('util'),
	request = require('request');

// all environments
var port = process.env.PORT || 3001; 

var org = nforce.createConnection({
	  //clientId: '3MVG9A2kN3Bn17huFN0b_0IIMm1QeLiR7ixYy5D60OdsqPcle0PF2HN.RByIabew5yDR4KdZ6SrTz_r9liqZG',
	  //clientSecret: '8093287766885948229',
	  //redirectUri: 'http://localhost:3001/auth/tiqconnect/callback',
	  clientId: '3MVG9A2kN3Bn17huFN0b_0IIMm64dpwfNyetlmBv0GQj0cmT49ZyKvvbmf07a16hY.e8TOIwoRR5aPr46eELb',
	  clientSecret: '5288898514549948088',
	  redirectUri: 'https://riq.herokuapp.com/auth/tiqconnect/callback',
	  apiVersion: 'v27.0',  // optional, defaults to current salesforce API version
	  environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
	  mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
	});

var oauth;

/**
 * Create the server and configure it
 */
var app = express();
app.set('title', 'Timeline IQ');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.engine('html', swig.renderFile);

app.use(express.bodyParser());
app.use(express.logger());
app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.cookieParser('3MVG9A2kN3Bn17huFN0b_0IIMmwWY_JSmQedLaC6lqQiioH_eZ3LCyoYykGOnEvg.xPxfiEsmFrCJewWx3Rrp'));

app.use(express.session({secret:'3MVG9A2kN3Bn17huFN0b_0IIMmwWY_JSmQedLaC6lqQiioH_eZ3LCyoYykGOnEvg.xPxfiEsmFrCJewWx3Rrp'}));
app.use(org.expressOAuth({onSuccess: '/auth/tiqconnect/callback', onError: '/oauth/error'}));  // <--- nforce middleware

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/auth/tiqconnect/callback', function(req, res) {
	console.log("SF login success:" + util.inspect(req.session.oauth, { showHidden: false }));

	request(req.session.oauth.id+'?format=json&oauth_token='+ req.session.oauth.access_token, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
			console.log("SF login success:" + util.inspect(body, { showHidden: false }));
		    req.session.userdetails = JSON.parse(body);
			res.redirect('/account');
		  }
	});
});


app.get('/', routes.index);
app.get('/logout', usermanagment.logoutAndRedirectToHomePage);
app.get('/login', usermanagment.clearSessionAndShowLoginPage);
app.post('/timelinelogin', usermanagment.recordUserDetailsAndVerifySFLogin(org));
app.get('/sf-login', usermanagment.redirectToSalesfroceUserPassLogin(org));
app.get('/userprofile', usermanagment.showUserProfilePage(org));

app.get('/account', checkIfUserIsAutherisedBySalesForce, account.getaccounts(org));
app.get('/strem-account', checkIfUserIsAutherisedBySalesForce, account.streamaccounts(org));

app.get('/gettotalrevenueofall', checkIfUserIsAutherisedBySalesForce, account.gettotalrevenueofall(org));
app.get('/getannualrevenuepercent', checkIfUserIsAutherisedBySalesForce, account.getannualrevenuepercent(org));
app.get('/getproductsbought', checkIfUserIsAutherisedBySalesForce, account.getproductsbought(org));
app.get('/getacquiredthrough', checkIfUserIsAutherisedBySalesForce, account.getacquiredthrough(org));
app.get('/getaccountactivity', checkIfUserIsAutherisedBySalesForce, account.getaccountactivity(org));
app.get('/getintroducedondate', checkIfUserIsAutherisedBySalesForce, account.getintroducedondate(org));
app.get('/getclientsincedate', checkIfUserIsAutherisedBySalesForce, account.getclientsincedate(org));
app.get('/getlifetimevalue', checkIfUserIsAutherisedBySalesForce, account.getlifetimevalue(org));
app.get('/getimetoacquire', checkIfUserIsAutherisedBySalesForce, account.getimetoacquire(org));

app.get('/accounttimeline', checkIfUserIsAutherisedBySalesForce, account.getaccountdetails(org));


function checkIfUserIsAutherisedBySalesForce(req, res, next) {
  if (req.session.oauth && req.session.oauth.access_token) {
    next();
  } else {
    res.redirect('/login');
  }
};

	
app.listen(port, function(){
	  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});


