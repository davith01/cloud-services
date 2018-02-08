/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict'; 

var cron = require('node-cron'),
    searchList = require('./search-list');
 
module.exports = {
	init: function() {
		cron.schedule('* * * * *', function(){
		  searchList.init();
		});
	}
	
};