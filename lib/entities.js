/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict';

module.exports = {
	"lc_list" : {
		"listId": {"PK":"autoIncrement"},
		"listName": {"type":"String","maxsize":"255","required":true},
		"listUrl": {"type":"String","maxsize":"255","required":true},
		"lastDayUpdated":{"type":"Date"},
		"usersInList": {"type":"Number"},
		"status": {"type":"Index","values":"[1:'Active',0:'Inactive']"},
		"persons": {"type":"JoinMany","entity":"lc_person","required":true}
	},
	"lc_person" : {
		"personId": {"PK":"autoIncrement"},
		"lastName": {"type":"String"},
		"personType": {"type":"String","required":true},
		"programList": {"type":"String"},
		"regDateList": {"type":"Date"},
		"lastDayUpdated": {"type":"Date"},
		"alias": {"type":"JoinMany","entity":"lc_alias","required":true},
		"address": {"type":"JoinMany","entity":"lc_address","required":true},
		"listId": {"type":"Number"}
	},
	"lc_alias":{
		"quality": {"type":"String"},
		"lastName": {"type":"String"},
		"firstName": {"type":"String"},
		"aliasName": {"type":"String"}
	},
	"lc_address":{
		"address": {"type":"String"},
		"city": {"type":"String"},
		"state": {"type":"String"},
		"country": {"type":"String"}
	},
	"workingGroup" : {
	  "workingGroupid": {"PK":"autoIncrement"},
	  "workingGroupName": {"type":"String","maxsize":"255","required":true,"audit":"[addList,dropList]"},
	  "permissions": {"type":"JsonString","required":true},
	  "users": {"type":"JoinMany","entity":"userWorkingGroup","audit":"[addList,dropList]"}
	},
	"user": {
	  "userId": {"PK":"autoIncrement"},
	  "userName": {"type":"String","maxsize":"255","required":true,"Unique":true},
	  "userPassword": {"type":"Password","maxsize":"255","required":true},
	  "email": {"type":"Email","maxsize":"255","required":true},
	  "person": {"type":"JoinOne","entity":"person","required":true},
	  "status": {"type":"Index","values":"[1:'Active',0:'Inactive']","default":'1'},
	  "workingGroups": {"type":"JoinMany","entity":"userWorkingGroup","entityJoin":"workingGroup","audit":"[updateList]"}
	},
	"userWorkingGroup": {
		"date":{"type":"Sysdate","maxsize":"255","required":true}
	},
	"person": {
	  "personId": {"PK":"autoIncrement"},
	  "personName": {"type":"String","maxsize":"255"},
	  "personLastName": {"type":"String","maxsize":"255"},
	  "birthDay": {"type":"Date"},
	  "genere": {"type":"Index","values":"[1:'Male',2:'Female']"},
	  "personIcon": {"type":"Image"},
	  "contactInfo": {"type":"JoinOne","entity":"contactInfo","required":true}
	},
	"contactInfo": {
	  "contactInfoId": {"PK":"autoIncrement"},
	  "address": {"type":"String","maxsize":"255"},
	  "phoneNumber": {"type":"String","maxsize":"50"},
	  "phoneNumberAlt": {"type":"String","maxsize":"50"},
	  "email": {"type":"Email","maxsize":"255"}
	}
};