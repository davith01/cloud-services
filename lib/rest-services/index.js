/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict';

var express = require('express'),
	router = express.Router(),
	utils = require('../utils'),
	login = require('./login'),
	traslate = require('./traslate'),
	entity = require('../mysql/entity');

//Rest Services

router.post('/login/auth', login.loginIn);
router.post('/logout', login.logOut);

router.get('/traslate/:lang', traslate.getTraslate);
router.post('/traslate/:lang', traslate.setTraslate);

router.get('/services/modules', function getModules(req,res){
	var modules = req.session && req.session.modules ? req.session.modules : [];
	res.header('Content-Type', 'text/json').send({"status":200,"data":modules});
});

router.post('/entity/:entityName', function getModules(req,res){
	var entityName =  req.params.entityName;
	entity.get(entityName,req.body,function(err,request){
		if(err) res.header('Content-Type', 'text/json').send({"status":err});
		else res.header('Content-Type', 'text/json').send({"status":200,"data":request});
	});
	
});


module.exports = router;
