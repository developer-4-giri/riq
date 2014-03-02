exports.index = function(req, res){
  res.render("login.html", { page_title: 'Login to TimelineIQ' });
};