/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('login', { title: 'Timeline IQ - Salesforce Login' })
};

exports.base = function(req, res){
	  res.render('base', { title: 'Base Template' })
};
