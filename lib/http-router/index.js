/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict';

var express = require('express'),
	router = express.Router(),
	utils = require('../utils'),
	metadata = require('../mysql/metadata');

function validatePermission(workingGroups,module,action){
	for(var i=0;i<workingGroups.length;i++){
		if(workingGroups[i].permissions && workingGroups[i].permissions[module]){
			
			for(var j=0;j<workingGroups[i].permissions[module].length;j++){
				
				if(workingGroups[i].permissions[module][j]===action){
					
					return true;
				}
			}
		
		}
	}
	return false;
}

//Http Request
router.get('/login', function(req, res){
	res.render('login');
});

router.get('/', function(req, res){
	if(req.session && req.session.user)
	  res.render('index',{"session":req.session});
	else res.render('login');
});

router.get('/home', function(req, res){
	/*if(req.session.user)
		res.render('home');
	else res.render('login');
	*/
});

router.get('/views/home', function(req, res){
	res.render('home');
});

router.get('/views/:module/:action', function(req, res){
	var module =  req.params.module;
	var action =  req.params.action.replace('-','_');
	var workingGroups =  req.session.workingGroups;
	if(req.session.user) {
		if(validatePermission(workingGroups,module,action)) {
			res.render(module+'/'+action,{"session":req.session});
		}
		else res.render('page_403');
	}
	else res.render('login');
});

router.post('/Admin/buildDatabase', function(req, res){
	var configFile = req.body.configFile || 'mysql-connection.json';
	var connection = utils.loadFileSync(configFile);
	var schema = connection.database;
	var user = {"name":connection.user,"password":connection.password,"hostType":connection.host};
	var root = {};
	if(req.body.connection)
		root.connection = req.body.configFile || 'mysql-root-connection.json';
	require('./lib/mysql/metadata').buildDatabase(schema,user,root,false,function(result){
		res.header('Content-Type', 'text/json').send(result);
	});
});

module.exports = router;
