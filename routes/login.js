exports.login = function(req, res){
    req.logout();
    req.session.destroy();

    var userName = req.body.userName;
    var userPass = req.body.userPass;
    
    console.log('%s %s', userName, userPass);
};