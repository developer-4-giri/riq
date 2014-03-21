/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('bootstrap/login.html', { title: 'Timeline IQ - Login' })
};

exports.base = function(req, res){
	  res.render('base', { title: 'Base Template' })
};
