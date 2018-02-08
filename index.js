/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict';

var express = require('express'),
    app     = express(),
    http    = require('http'),
    server  = http.createServer(app),
    cons    = require('consolidate'),
	ejs     = require('ejs'),
	favicon = require('serve-favicon'),
	path    = require('path'),
	fs      = require('fs'),
	port    = process.env.PORT || 5656,
	crontab = require('./lib/crontab'),
	utils = require('./lib/utils'),
	connection = require('./lib/mysql/connection'),
	session = require('./lib/session'),
	httpRouter = require('./lib/http-router'),
	servicesRouter = require('./lib/rest-services');
	
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// To set html rendered by ejs  engine
app.engine('html', function (filePath, options, callback) { 
	cons.ejs(filePath,options,function(err, html){
		if(err) console.log(err);
		var rendered = ejs.render(html.toString(),options);
		return callback(null, rendered);
	});
});

//set engine html
app.set('view engine','html');

// path or directory html Templates
app.set('views', path.join(__dirname, 'views'));

// path or directory for javascript set to execute frontEnd
app.use(express.static(path.join(__dirname, 'assets')));

// Encoding for the response http
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//config database connection
app.use(connection); 

//config session cacke with storage
app.use(session.getSession());

//config Rest services responsess
app.use(servicesRouter);

//config http templates responsess
app.use(httpRouter);

app.get('*', function(req, res) {
    res.status(405).send('Method not allowed');
});

//config and start crontab jobs 
//app.use(crontab.init);

server.listen(port, function(){
	console.log('Listen %d', port);
});
