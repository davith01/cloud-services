/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict';

var Entities = require('../entities'),
	utils = require('../utils'),
	mysql = require('mysql'),
	connection = utils.loadFileSync('mysql-connection.json'),
	con = mysql.createConnection(connection),
	separator = ',';

function getColumnNamePk(entityName){
	var listPk = {};
	for(var attribute in Entities[entityName]){
		if(Entities[entityName][attribute]['PK']){
			listPk[attribute] = {};
		}
	}
	return listPk;
}
function getColumn(columnName,value,entity,callback){
	var column = entity[columnName] || {}, data = [],
		type = column.PK || column.type, headerColumn = '';
		
	if(type)	
	switch(type){
		case 'Sysdate':
			headerColumn = '';
			callback(headerColumn,value,columnName);
		break;
		case 'Password':
			headerColumn = columnName + ' = SHA2(?,224)';
			callback(headerColumn,value,columnName);
		break;
		case 'JoinMany':
			headerColumn = '';
			entity.foreingKeys = entity.foreingKeys || [];
			entity.foreingKeys.push({entity:column,column:value});
			callback(headerColumn,value,columnName);
		break;
		case 'JoinOne':
			var entityJoin = Entities[columnName],
				entityJoinName = columnName;
			
			/**/
			InsertEntity(columnName,value,function(err,result){
				if(!err) {
					var headerColumns = '';
					var listPk = getColumnNamePk(entityJoinName);
					var objInput = JSON.parse(JSON.stringify(listPk));
					for(var indxName in listPk){
						getColumn(indxName,result[indxName],entityJoin,function(hdCol,value,columnName){
							if(typeof value === 'object') 
							if(value.length > 0) for(var i=0;i<value.length;i++) data.push(value[i]);
							else data.push(value);
							else data.push(value);
							
							if(headerColumns.length > 0) headerColumns = separator + headerColumns;
							headerColumns = headerColumns + hdCol;
							ctrCallback(indxName);
						});
					}
					function ctrCallback(indxName){
						delete objInput[indxName];
						if(JSON.stringify(objInput) === '{}'){
							callback(headerColumns,data,columnName);
						}
					}
				}
			})
			/**/
		break;
		default:
			headerColumn = columnName + ' = ?';
			callback(headerColumn,value,columnName);
		break;
	}
	else {
		callback(headerColumn,value,columnName);
	}
}
function getHeaderColumns(input,entity,callback){
	var headerColumns = '', data = [],
		objInput = JSON.parse(JSON.stringify(input));
		
	for(var indxName in input){
		
		if(typeof input[indxName] === 'object') {
			
		}
		getColumn(indxName,input[indxName],entity,function(column,value,columnName){
			if(column.length > 0) {
				if(typeof value === 'object') 
				if(value.length > 0) for(var i=0;i<value.length;i++) data.push(value[i]);
				else data.push(value);
				else data.push(value);
				
				if(headerColumns.length>0) headerColumns = headerColumns + separator;
				headerColumns = headerColumns + column;
			}
			ctrCallback(columnName);
		});
	}
	function ctrCallback(indxName){
		
		delete objInput[indxName];
		if(JSON.stringify(objInput) === '{}'){
		 callback(headerColumns,data);
		}
	}
}
function reponseError(err,callback){
	err.appMessage = 'OneErrorWasHappend';
	if(err.code === 'ER_DUP_ENTRY') err.appMessage = 'DuplicateEntry';
	callback(err);
}

function InsertEntity(entityName,input,callback){
	var entity = Entities[entityName], headerColumns = '', data = [],
		sql = 'INSERT INTO ' + entityName + ' SET ',
		sqlwhere = '',
		isUpdate = false;
		
	var listPk = getColumnNamePk(entityName);
	
	for(var indx in listPk){
		if(input[indx]) {
			if(sqlwhere.length > 0) sqlwhere = sqlwhere + ' AND ';
			if(sqlwhere.length === 0) sqlwhere = ' WHERE ';
			sqlwhere = sqlwhere + ' ' + indx + ' = ' + '"'+input[indx]+'"';
		}
		else {
			sqlwhere = '';
			break;
			
		}
	}
	
	if(sqlwhere.length){
		isUpdate = true;
		sql = 'UPDATE ' + entityName + ' SET ';
	}
		
	getHeaderColumns(input,entity,function(headerColumns,data){
		
		sql = sql + headerColumns + sqlwhere;
		
		if(con)
		con.query(sql, data, function (err, result) {
			
			if(err) reponseError(err,callback);
			else {
				if(!isUpdate)
				for(var indx in listPk){
					input[indx] = result.insertId;
				}
				if(entity.foreingKeys){
					var size = entity.foreingKeys.length;
					for(var i=0;i<entity.foreingKeys.length;i++){
						var foreingKey = entity.foreingKeys[i];
						var inputForeing = null, foreingValue = null;
						for(var j=0; j<foreingKey.column.length; j++){
							foreingValue = foreingKey.column[j];
							//foreing = foreingKey.column[j];
							inputForeing = {};
							for(var indx in listPk){
								inputForeing[indx] = input[indx];
							}
							
							var listFk = getColumnNamePk(foreingKey.entity.entityJoin);
							for(var indx in listFk){
								inputForeing[indx] = foreingValue[indx];
							}
							
							InsertEntity(foreingKey.entity.entity,inputForeing,function(err,input){
								ctrlIndex(err);
							});
						}
						function ctrlIndex(err){
							size --;
							if(size === 0){
								callback(err,input);	
							}
						}
					}
				}
				else {
					
					callback(err,input);
				}
			}
		});
	});
}

function SelectEntity(entityName,data,callback){
	var entity = Entities[entityName];
	var sql = 'SELECT ', sqlSel = '', sqlWhere = '';
	if(data)
	if(data[0])	{
		var selection = data[0];
		for(var indx=0;indx < selection.length;indx++){
			if(entity[selection[indx]]){
				if(sqlSel.length>0) sqlSel = sqlSel + separator;
				sqlSel = sqlSel + selection[indx];
			}
		}
	}
	if(data[1]){
		var where = data[1];
		for(var attr in where){
			if(entity[attr]){
				if(sqlWhere.length>0) sqlWhere = sqlWhere + ' AND ';
				sqlWhere = sqlWhere + attr + ' = ' + '"'+where[atrr]+'"';
			}
		}
	}
	
	sql = 'SELECT ' + sqlSel + ' FROM  ' + entityName;
	if(sqlWhere.length>0)
		sql = sql + ' WHERE ' + sqlWhere;
	
	console.log(sql,data)
	con.query(sql, function (err, result) {
		if(err) reponseError(err,callback);
		else {
			callback(err,result);
		}
	});
}


module.exports = {
	get: function(entityName,input,callback){
		SelectEntity(entityName,input,function(err,request){
			callback(err,request);
		});
	},
	save: function(entityName,input,callback){
		
		con.beginTransaction(function(error) {
			if(error) reponseError(error,callback);
			else {
				InsertEntity(entityName,input,function(err,request){
					if(err)
					con.rollback(function(){
						reponseError(err,callback);
					});
					else
					con.commit(function(){
						callback(err,request);
					});
				});
			}
		});
	}
};
