exports.login = function(req, res){
    req.session.destroy();
    req.logout();

    var userName = req.body.userName;
    var userPass = req.body.userPass;
    
    console.log('%s %s', userName, userPass);
};

exports.sflogin = function(org){
	return function(req, res){
	    req.session.destroy();

	    console.log('Redirecting to SF login :'+ org.getAuthUri());
		res.redirect(org.getAuthUri());
	}
};

exports.logout = function(req, res){
    req.session.destroy();
    
    res.render('bootstrap/logout.html', { title: 'TimelineIQ - Logout Suceessfull' });
};
