/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict';

var con = require('./connection'),
	utils = require('../utils'),
	person = require('./person'),
	Entity = require('../entities')['user'],
	base128Encrypt = require('../encrypt');

var user = {
	//retrive available user
	authLogin: function(req, callback){
		
		var input = JSON.parse(JSON.stringify(req.body));
		
		var sql = "SELECT u.userId, userName, userPassword, status, email, p.personId, personName, personLastName, birthDay, genere, personIcon, contactInfoId ";
			sql = sql + " FROM user u INNER JOIN person p ON u.personId = p.personId ";
			//Calculate an SHA-2 checksum
			sql = sql + " WHERE userName = ? AND userPassword = SHA2(?,224)";
			sql = sql + " AND status = ? ";
		
		var userPassword = base128Encrypt.decrypt(input.userPassword);
		userPassword = userPassword.replace(/ /g,'');
		var data = [input.userName, userPassword, '1'];
		 
		req.getConnection(function(err,connection){
			connection.query(sql,data,function(err,rows){
				callback(err,rows ? rows[0] : null);
			});
		});
	},
	//retrive available list user
	listUser: function(req,callback){
		var input = JSON.parse(JSON.stringify(req.body));
		
		var sql = "SELECT userId, userName, u.config, p.personId, personName, personLastName, birthDay, genere, personIcon, contactInfoId";
			sql = sql + " FROM users u INNER JOIN person p ON u.personId = p.personId ";
			sql = sql + " WHERE u.status = ?";
			
		var data = {
			"status": "1"
		};
		
		req.getConnection(function (err, connection) {
			var query = connection.query(sql,[data], function(err, result) {
				callback(err,result);
			});
		});
	},
	//retrive user, person and contactInfo
	getUser: function(req, callback){
		var input = JSON.parse(JSON.stringify(req.body));
		var data = {};
		var sql = "SELECT u.userId, userName, p.personId, personName, personLastName, birthDay, genere, personIcon, contactInfoId";
			sql = sql + " FROM user u INNER JOIN person p ON u.personId = p.personId ";
			sql = sql + " WHERE u.userId = ?";
		
		data.userId = input.userId;
		
		req.getConnection(function(err,connection){
			connection.query(sql,[data],function(err,rows){
				callback(err,rows ? rows[0] : null);
			});
		});
	},
	//retrive contact info for the user
	getContactInfo: function(req, callback){
		var input = JSON.parse(JSON.stringify(req.body));
		var data = {};
		var sql = "SELECT c.contactInfoId, address, phoneNumber, phoneNumberAlt, email";
			sql = sql + " FROM contactInfo c  ";
			sql = sql + " WHERE c.personId = ?";
			data.personId = input.personId;
			
		req.getConnection(function(err,connection){
			connection.query(sql,[data],function(err,rows){
				callback(err,rows ? rows[0] : null);
			});
		});
	},
	//retrive workingGroups available for the user
	getWorkingGroups: function(req, callback) {
		
		var sql = "SELECT w.workingGroupId, workingGroupName, permissions ";
			sql = sql + " FROM userWorkingGroup u INNER JOIN workingGroup w ON  u.workingGroupId = w.workingGroupId";
			sql = sql + " WHERE u.userId = ?";
		
		var data = req.body.userId;
		
		req.getConnection(function(err,connection){
			connection.query(sql,[data],function(err,result){
				if(err) console.log(err);
				else {
					for(var i=0;i<result.length;i++){
						result[i].permissions = utils.jsonParse(result[i].permissions);
					}
					callback(err,result);	
				}
			});
		});
	}
	/** /
	save: function(input, callback){
		var data = [], sql = 'INSERT INTO user set ', header = '';
		var type = '';
			
		for(var attr in input){
			if(Entity[attr]) {
				switch(Entity[attr].type){
					case 'Password':
						if(header.length>0) header = header + ',';
						header = header + attr + ' = SHA2(?,224) ';
						data.push(input[attr]);
					break;
					default:
						if(header.length>0) header = header + ',';
						header = header + attr + ' = ? ';
						data.push(input[attr]);
					break;
				}
			}
			else if(Entity[attr+'Id']) {
				attr = attr+'Id';
				switch(Entity[attr].type){
					case 'Join':
						if(header.length>0) header = header + ',';
						header = header + attr + ' = SHA2(?,224) ';
						data.push(input[attr]);
					break;
				}
			}
		}
		
		return ;
		
		
		//?, userPassword = SHA2(?,224) ";
		var data = {
			userName: input.userName,
			config: input.config,
			personId: personId
		};
			
		req.getConnection(function (err, connection) {
			var query = connection.query(sql,[data,input.userPassword], function(err, result) {
				if(err) console.log(err);
				callback(err,result.insertId);
			});
		});
		person.savePerson(req,function(err,personId){
		});
	}
	/**/
};

module.exports = user;
