exports.login = function(req, res){
    console.log(req.headers);

    var userName = req.body.userName;
    var userPass = req.body.userPass;
    
    console.log('%s %s', userName, userPass);

};