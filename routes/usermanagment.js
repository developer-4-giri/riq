var	util = require('util'),
	request = require('request');

exports.clearSessionAndShowLoginPage = function(req, res){
    req.session.destroy();
    res.render('bootstrap/login.html', { title: 'TimelineIQ - Login' });
};

exports.recordUserDetailsAndVerifySFLogin = function(org){
	return function(req, res){
		var userName = req.param('username');
		var userPass = req.param('userpass');
		
	    org.authenticate({ username: userName, password: userPass}, function(err, resp){
		  if(!err) {
		    req.session.oauth = resp;

		    request(req.session.oauth.id+'?format=json&oauth_token='+ req.session.oauth.access_token, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
				    req.session.userdetails = JSON.parse(body);
					res.redirect('/account');
				  }
			});

		  } else {
		    console.log('Error while authenticating with Salesforce for User('+ userName+') : ' + err.message);
		  }
		});

	}
};

exports.redirectToSalesfroceUserPassLogin = function(org){
	return function(req, res){
	    req.session.destroy();
	    console.log('Redirecting to SF login :'+ org.getAuthUri());
		res.redirect(org.getAuthUri());
	}
};

exports.logoutAndRedirectToHomePage = function(req, res){
    req.session.destroy();
	res.redirect('/');
};
