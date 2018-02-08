/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict'; 

var request = require('request');

function getAttr(value,keys){
	var result = value;
	for(var i=0; i<keys.length;i++) {
	  if(result[keys[i]]) result = result[keys[i]];
	  else { result = ''; break }
	}
	return result;
}
function getAddress(entity){
	var result = [], address = null;
	if(entity['addressList'] && entity['addressList'].length > 0){
		for(var indx = 0; indx < entity['addressList'].length; indx ++){
			address = entity['addressList'][indx]['address'];
			//console.log(JSON.stringify( address))
			for(var i=0;i<address.length;i++){
				result.push({
					city: getAttr(address[i],['city',0]),
					state: getAttr(address[i],['stateOrProvince',0]),
					country: getAttr(address[i],['country',0]),
					address: getAttr(address[i],['address1',0]) + ' ' +
							  getAttr(address[i],['address2',0]) + ' ' +
							  getAttr(address[i],['address3',0])
				});

			}
		}
	}
	return result;
}
function getAlias(entity){
	var result = [], alias = null;
	if(entity['akaList'] && entity['akaList'].length > 0){
		for(var indx = 0; indx < entity['akaList'].length; indx ++){
			alias = entity['akaList'][indx]['aka'];
			for(var i=0;i<alias.length;i++){
				result.push({
					quality: alias[i]['category'][0],
					lastName: alias[i]['lastName'][0]
				});
			}
		}
	}
	return result;
}
var List = {
	getPersons: function(data){
		var persons = [], person = null, entity = null;
		if(data['sdnList']['sdnEntry']);
		for(var i=0; i<data['sdnList']['sdnEntry'].length;i++){
			entity = data['sdnList']['sdnEntry'][i];
			person = {
				personType: getAttr(entity,['sdnType',0]),
				lastName: getAttr(entity,['lastName',0]),
				programList: getAttr(entity,['programList',0,'program',0])
				//lastDayUpdated: new Date().now,
				//alias: getAlias(entity),
				//address: getAddress(entity)
			};
			
			persons.push(person);
		}
		return persons;
	}
}
				
module.exports = List;
