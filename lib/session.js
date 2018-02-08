/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict'; 

//Configurando uso de session en el servidor
var utils = require('./utils'),
	session = require('express-session'),
	MySQLStore = require('express-mysql-session')(session),
    connection = utils.loadFileSync('mysql-connection.json'),
	sessionStore = new MySQLStore(connection);
	
session = session({
    secret: 'keyboard cat',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
	cookie: { path: '/', httpOnly: true, secure: false, maxAge: 300000 } // 5 min default
});

module.exports = {
	getSession: function(){
		return session;
	}
};