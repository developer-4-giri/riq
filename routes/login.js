exports.login = function(req, res){
    req.session.destroy();
    res.render('bootstrap/login.html', { title: 'TimelineIQ - Login' });
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
