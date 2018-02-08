/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict';

var connection  = require('express-myconnection'), 
	mysql = require('mysql'),
	utils = require('../utils'),
	connectionParams = utils.loadFileSync('mysql-connection.json');
	
module.exports = connection(mysql,connectionParams,'request');