var swig = require('swig'),
	util = require('util');

exports.getaccounts = function(org){
	return function(req, res){
		swig.setFilter('isObject', function(element) {
		  return typeof element == "string";
		});
	
		var query_string = 'select AccountNumber, Active__c, AnnualRevenue, Description, Id, Name, OwnerId, Type, (select AccountId, Amount, CloseDate, CreatedDate, Description, Id, IsClosed, IsDeleted, IsWon, LeadSource, Name, OwnerId, Pricebook2Id, StageName, Type from Opportunities) from Account';
		org.query({ query:query_string, oauth: req.session.oauth  }, function(err, resp){
			if(!err && resp.records) {
				for(var i = 0; i < resp.records.length;i++){
					var record = resp.records[i];
					var porducts_bought = '';
					
					if(record._fields.opportunities != null){
						for(var count = 0; count < record._fields.opportunities.records.length ; count++) {
							console.log(' Opportunity Record:' + util.inspect(record._fields.opportunities.records[count], { showHidden: false }) );
						}
					}
							
				}
			}
				  
			res.render("accounts.html", { accounts: resp.records });
		});
		
	}
};