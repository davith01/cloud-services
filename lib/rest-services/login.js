/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict';

var user = require('../mysql/user'),
    menu = require('./menu');

module.exports = {

  loginIn: function(req, res){
	  
	if(req.body.action==='Login') {
		
		user.authLogin(req,function (err,user){
				
			if(err) {
				console.log(err)
				res.header('Content-Type', 'text/json').send({"status":601,"message":"ErrortoinvokeServices"});	
			} else {
				if(user) {
					//retrive menu available for the user
					req.body.userId = user.userId;
					menu.getMenuByUser(req,function(err,menuSide,modules,workingGroups){
						
						var genere = user.genere === 1 ? 'male': user.genere === 2 ? 'female' : 'male';
						if(!user.personIcon) {
							user.personIcon = 'images/user-profiles/'+genere+'.png';
						}
						req.session.user = user;
						req.session.lang = user.lang_default || 'es';
						
						try{
						if(user.session_timeout)
						req.session.cookie.maxAge = parseInt(user.session_timeout);
						}catch(err){console.log(err)}
						req.session.menu = menuSide;
						req.session.modules = modules;
						req.session.workingGroups = workingGroups;
						res.header('Content-Type', 'text/json').send({"status":200,"data":"success"});
					});
				}
				else {
					res.header('Content-Type', 'text/json').send({"status":701,"message":"UserOrPasswordInvalid"});	
				}
			}
		});
	}
	else {
		res.header('Content-Type', 'text/json').send({"status":701,"message":"ErrortoinvokeServices"});
	}	
  },
  logOut: function(req,res){
	delete req.session;
	res.header('Content-Type', 'text/json').send({"status":200,"data":"success"});
  }
};
