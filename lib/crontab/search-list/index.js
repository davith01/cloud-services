/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict'; 

var request = require('request'),
    xml2js = require('xml2js'),
	Http = require('http'),
	path   = require('path'),
	fs = require('fs'),
	parser = new xml2js.Parser(),
	fs = require('fs'),
	Entity = require('../../mysql/entity'),
	sdnList = require('./sdnList');

function loadListFile(list,callback){
	
	fs.readFile(path.join('public/',list.listName + '.xml'), "utf-8", function(error, body) {
		if(error) { console.log(error); callback(error); }
		else {
			parser.parseString(body, function (err, result) {
				if(err) {
				  console.log(err);
				  callback(err);
				}
				else callback(err,list,result);
			});
		}
	});
}

function loadList(list,callback){
	request.defaults({'proxy':'http://172.22.84.11:9128'})
	.get(list.listUrl, function (error, response, body) {
		if(error) { console.log(error); callback(error); }
		else if(response.statusCode !== 200){ console.log(response); callback(response); }
		else {
			parser.parseString(body, function (err, result) {
				if(err) {
				  console.log(err);
				  callback(err);
				}
				else callback(err,list,result);
			});
		}
	});
}

var LcList = {
	
	synchronize: function(){
		
		var person = [], personList = [];
		
		Entity.get('lc_list',null,function(err,lcLists){
			
			for(var i=0;i<lcLists.length;i++){
				list = lcLists[i];
				
				loadListFile(list,function(err,list,result){
				//loadList(list,function(err,list,result){
					
					if(err) { console.log(err); return; }
					
					var totalUser = 0, entity = null;
					if( list.listName === 'OFACCSL' || list.listName === 'OFACSDN') {
					  list.lastDayUpdated = result.sdnList['publshInformation'][0]['Publish_Date'][0];
					  list.persons = sdnList.getPersons(result);
					}
					list.usersInList = list.persons.length;
					Entity.save('lc_list',list,function(err,lcLists){
						if(err) console.log(err)
						//console.log(JSON.stringify(list.listName),list.persons.length);	
					});
					
				});
			}			 
			
		}); 
	}
}

module.exports = LcList;
