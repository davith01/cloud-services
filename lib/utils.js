/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict';

var fs = require('fs'),
	path = require('path');
	
var utils = {
	appendFile(fileName, sql, callback){
		fs.appendFile(fileName, sql, function(err){
		  if(err) console.log(err);
		  if(callback) callback(err);
		});
	},
	loadFileSync: function(resource,dirname){
		try {
			//Modulo en Node.js para manipular archivos
			dirname = dirname || path.join(__dirname , '/../conf/');
			var result = fs.readFileSync(path.join(dirname,resource), "utf-8");
			result = JSON.parse(result);
			return result;
		} catch (err) {
			console.log(result);
			console.log(err);
			return null;
		}
	},
	loadFile: function(resource,callback,dirname){
		try {
			//Modulo en Node.js para manipular archivos
			var result = null;
			dirname = dirname || path.join(__dirname , '/../conf/');
			fs.readFile(path.join(dirname,resource), "utf-8", function(err, data) {
				if(err) console.log(err);
				try {
					result = JSON.parse(data);
				} catch (err) {
					console.log(err); 
				}	
				callback(err,result);
				
			});
		} catch (err) {
			console.log(err);
			callback(err,result);
		}
	},
	jsonParse: function(req){
		try {
			var res = JSON.parse(req);
			return res;
		}
		catch(err){
			console.log(req);
			console.log(err);
			return {};
		}
	}
};

module.exports = utils;
