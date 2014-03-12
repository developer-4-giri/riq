var swig = require('swig'),
	util = require('util');

exports.getaccounts = function(org){
	return function(req, res){
		swig.setFilter('isObject', function(element) {
		  return typeof element == "string";
		});
	
		org.query({ query:'select id, name, ownerid  from account', oauth: req.session.oauth  }, function(err, resp){
			  if(!err && resp.records) {
					console.log(' Accounts :' + util.inspect(resp.records, { showHidden: false }));
					res.render("accounts.html", { accounts: resp.records });
			  } 
		});
		
	}
};