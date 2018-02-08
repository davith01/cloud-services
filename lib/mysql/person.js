/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict';

var con = require('./connection'),
    utils = require('../utils');

var contactInfo = {
	saveContactInfo: function(req, callback){
		var input = JSON.parse(JSON.stringify(req.body));
		var data = {
			address : input.contact.address, 
			phoneNumber : input.contact.phoneNumber, 
			phoneNumberAlt : input.contact.phoneNumberAlt, 
			email : input.contact.email
		};
		
		var sql = "INSERT INTO contactInfo set ? ";
		req.getConnection(function (err, connection) {
			var query = connection.query(sql,[data], function(err, result) {
				callback(err,result.insertId);
			});
		});
	}
};
var person = {
	savePerson: function(req, callback){
		
		var input = JSON.parse(JSON.stringify(req.body));
		
		contactInfo.saveContactInfo(req,function(err,contactInfoId){
			
			if(err){console.log(err);callback(err);}
		
			var data = {
				personName: input.person.personName,
				birthDay: input.person.birthDay,
				genere: input.person.genere,
				iconPerson: input.person.iconPerson,
				contactInfoId: contactInfoId
			};
		
			var sql = "INSERT INTO person set ? ";
			req.getConnection(function (err, connection) {
				var query = connection.query(sql,[data], function(err, result) {
					callback(err,result.insertId);
				});
			});
		});
	}
};
module.exports = person;
