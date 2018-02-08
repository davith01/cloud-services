/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict';

var Entities = require('../entities'),
	utils = require('../utils'),
	mysql = require('mysql'),
	endLine = '\n',
	endRow = ';',
	fileName = '',
	separator = ',',
	listCreated = {},
	autoIncrement = 'AUTO_INCREMENT',
	longLine = '-- -----------------------------------------------------';

function responseError(err,callback){
	throw err
	callback(err);
}
function createSchema(con,schema,callback){
	var header = longLine + endLine + '-- Schema ' + schema + endLine + longLine + endLine;
	var sql = 'DROP SCHEMA IF EXISTS ' + schema;
	
	if(con)
	con.query(sql, function (err, result) {
		utils.appendFile(fileName, header + sql + endRow + endLine + endLine, function(){
			sql = 'CREATE SCHEMA IF NOT EXISTS ' + schema;
			if(err) responseError(err,callback);
			else 
			con.query(sql, function (err, result) {
				utils.appendFile(fileName, sql + endRow + endLine + endLine, function(){
					if(err) responseError(err,callback);
					else callback(schema + ' created!!');
				});
			});
		});
	});
	else 
	utils.appendFile(fileName, header + sql + endRow + endLine + endLine, function(){
		sql = 'CREATE SCHEMA IF NOT EXISTS ' + schema;
		utils.appendFile(fileName, sql + endRow + endLine + endLine, function(){
			callback(schema + ' created!!');
		});
	});	
}

function createUser(con,schema,user,callback){
	if(!user) { callback(); return; } 
	var header = longLine + endLine + '-- User '+ user.name + endLine + longLine + endLine;
	//var userName = '\''+user.name+'\'@\''+user.hostType+'\'';
	var userName = user.name;
	var sql = 'DROP USER IF EXISTS ' + userName;
			
	if(con)
	con.query(sql, function (err, result) {
		utils.appendFile(fileName, header + sql + endRow + endLine + endLine, function(){
			var sql = 'CREATE USER '+userName+' IDENTIFIED BY \'' + user.password + '\'';
			if(err) responseError(err,callback);
			else
			con.query(sql, function (err, result) {
				utils.appendFile(fileName, sql + endRow + endLine + endLine, function(){
					var sql = 'GRANT ALL PRIVILEGES ON ' + + '.* TO '+ userName;
					if(err) responseError(err,callback);
					else
					con.query(sql, function (err, result) {
						utils.appendFile(fileName, sql + endRow + endLine + endLine, function(){
						  if(err) responseError(err,callback);
						  else callback('user ' + userName + ' created!!');
						});
					});
				});
			});	
		});
	});
	else
	utils.appendFile(fileName, header + sql + endRow + endLine + endLine, function(){
		var sql = 'CREATE USER '+userName+' IDENTIFIED WITH mysql_native_password AS \'' + user.password + '\'';
		utils.appendFile(fileName, sql + endRow + endLine + endLine, function(){
			var sql = 'GRANT USAGE ON *.* TO ' + userName;
			con.query(sql, function (err, result) {
				if(err) responseError(err,callback);
				else
				utils.appendFile(fileName, sql + endRow + endLine + endLine, function(){
				  callback('user ' + userName + ' created!!');
				});
			});
		});
	});
}

function getHeaderColumns(schema,entityName,columnName,column,isJoin){
	
	var headerColumn = '', required = '',  columnJoinNameId = '', defaultValue = '',
		type = column.PK ? 'PK' : column.type;
	
	switch(type){
		case 'PK':
			headerColumn = columnName + ' ' + getType(column) + ' NOT NULL';
			if(typeof isJoin === 'undefined' || !isJoin) {
				if(column.PK === 'autoIncrement') headerColumn = headerColumn + ' ' + autoIncrement;
				listCreated[entityName].primarykeys.push(columnName);
			}
		break;
		case 'autoIncrement':
			headerColumn = columnName + ' ' + getType(column) + ' NOT NULL';
			if(typeof isJoin === 'undefined' || !isJoin) {
				headerColumn = headerColumn + ' ' + autoIncrement;
				listCreated[entityName].primarykeys.push(columnName);
			}
		break;
		case 'JoinMany': 
			var entityJoinName = column.entity, headerJoinColumn = '',
				pkEntityList = getColumnNamePk(entityName),
				column = null, columnNameId = '', columnHeaders = '';
			
			if(!listCreated[entityJoinName]) createEntity(schema,entityJoinName);
			
			for(var indx in pkEntityList){
				columnNameId = pkEntityList[indx];
				listCreated[entityJoinName].primarykeys.push(columnNameId);
				columnHeaders = listCreated[entityJoinName].columnHeaders;
				if(columnHeaders.length>0) columnHeaders = columnHeaders + separator + endLine;
				column = Entities[entityName][columnNameId];
				headerJoinColumn = getHeaderColumns(schema,entityName,columnNameId,column,true);
				listCreated[entityJoinName].columnHeaders = columnHeaders + headerJoinColumn;
			}
			listCreated[entityJoinName].foreingKeys.push({
				entityName: entityJoinName,
				entityJoinName: entityName,
				columnsIds: pkEntityList
			});
			
		break;	
		case 'JoinOne':
			var entityJoinName = column.entity;
			if(!listCreated[entityJoinName]) createEntity(schema,entityJoinName);
			
			var pkJoinList = getColumnNamePk(entityJoinName);
			for(var entIndx in pkJoinList) {
				columnJoinNameId = pkJoinList[entIndx];
				if(headerColumn.length>0) headerColumn = headerColumn + separator + endLine;
				column = Entities[entityJoinName][columnJoinNameId];
				headerColumn = headerColumn + columnJoinNameId + ' ' + getType(column);
				required = column.required ? ' NOT NULL' : ' NULL';
				headerColumn = headerColumn + required;
			}
			pkEntityList = getColumnNamePk(entityName);
			listCreated[entityName].foreingKeys.push({
				entityName: entityName,
				entityJoinName: entityJoinName,
				columnsIds: pkJoinList
			});
		break;
		default:
		  headerColumn = columnName + ' ' + getType(column);
		  required = column.required ? ' NOT NULL' : ' NULL';
		  headerColumn = headerColumn + required;
		break;
	}
	// uniqueKeys
	if(column.Unique){
		if(typeof isJoin === 'undefined' || !isJoin) {
			listCreated[entityName].uniqueKeys.push(columnName);
		}
	}
	// default Value
	if(column.default){
		defaultValue =  ' DEFAULT "' + column.default + '"';
		headerColumn = headerColumn + defaultValue;
	}
	
	return headerColumn;
}

function createEntity(schema,entityName){
	if(!listCreated[entityName]) {
		listCreated[entityName] = { primarykeys: [], foreingKeys: [], uniqueKeys: [] };
		var column = null, columnHeaders = '', colHeader = '';
		for(var colName in Entities[entityName]){
			column = Entities[entityName][colName];
			colHeader = getHeaderColumns(schema,entityName,colName,column);
			if(colHeader.length > 0 ){ 
				if(columnHeaders.length>0) columnHeaders = columnHeaders + separator + endLine;
				columnHeaders = columnHeaders + colHeader;
			}
		}
		listCreated[entityName].columnHeaders = columnHeaders;
	}
}

function getColumnNamePk(entityName){
	var listPk = [];
	for(var attribute in Entities[entityName]){
		if(Entities[entityName][attribute]['PK']){
			listPk.push(attribute);
		}
	}
	return listPk;
}

function getType(column){
	var type = column.PK || column.type;
	switch(type){
		case 'autoIncrement':
		case 'Number':
			 var size = column.maxsize || '11';
			 type = 'INT('+size+')';
		break;
		default: 
			var size = column.maxsize || '255';
			type = 'VARCHAR('+size+')';
		break;
	}
	
	return type;
}

function getIndexName(schema,foreingKey,index){
	
	index = index > 0 ? index : ''; 
	var entityName = foreingKey.entityName;
	var entityJoinName = foreingKey.entityJoinName;
	var indexName = 'fk_'+entityName+'_'+entityJoinName + index + '_idx';
	var columnsPkIds = '';
	var pkList = foreingKey.columnsIds || listCreated[entityJoinName].primarykeys;
	for(var pkIndx in pkList) {
		if(columnsPkIds.length > 0) columnsPkIds = columnsPkIds + separator;
		columnsPkIds = columnsPkIds + pkList[pkIndx] + ' ASC';
	}
	return 'INDEX ' + indexName + ' ( ' + columnsPkIds + ' )';
}
function getConstraintName(schema, foreingKey, index){
	
	var entityName = foreingKey.entityName;
	var entityJoinName = foreingKey.entityJoinName;
	var costraintName = 'fk_'+entityName+'_'+entityJoinName + index;
	var columnsPkIds = '';
	
	var pkList = foreingKey.columnsIds;
	for(var pkIndx in pkList) {
		if(columnsPkIds.length > 0) columnsPkIds = columnsPkIds + separator;
		columnsPkIds = columnsPkIds + pkList[pkIndx];
	}
	var foreingPkIds = '';
	var pkList = listCreated[entityJoinName].primarykeys;
	for(var pkIndx in pkList) {
		if(foreingPkIds.length > 0) foreingPkIds = foreingPkIds + separator;
		foreingPkIds = foreingPkIds + pkList[pkIndx];
	}
	
	return  'CONSTRAINT ' + costraintName +
		    '  FOREIGN KEY ( ' + columnsPkIds + ' )' +
			'  REFERENCES ' + schema + '.' + entityJoinName + ' ( ' + columnsPkIds + ' ) ' +
			'  ON DELETE NO ACTION ON UPDATE NO ACTION';
}
function getUniqueName(schema, columnName, index){
	return  'UNIQUE ('+columnName+')';
}
function createConstraint(con,schema,entityName,callback){

	function constraintFactory(constraintList,getConstraints){
		var constraints = '';
		for(var indx in constraintList){
			if(constraints.length > 0 ) constraints = constraints + separator + endLine + ' ADD ';
			constraints = constraints + getConstraints(schema,constraintList[indx],indx);
		}
		return constraints === '' ? null : constraints;
	}
	
	var header = '',
		uniquesKeysList = listCreated[entityName].uniqueKeys,
		foreingKeysList = listCreated[entityName].foreingKeys,
		constraints = constraintFactory(foreingKeysList,getConstraintName), 
		uniques = constraintFactory(uniquesKeysList,getUniqueName),
		indexes = constraintFactory(foreingKeysList,getIndexName);
	
	
	if(!( constraints || uniques || indexes)) { callback(); return; }
	
	header = longLine + endLine;
	header = header + '-- ALTER TABLE ' + schema + '.' + entityName + endLine;
	header = header + longLine + endLine;

	var sql = 'ALTER TABLE ' + schema + '.' + entityName;
	if(constraints) sql = sql + endLine + ' ADD ' + constraints;
	if(uniques) {
		if(constraints) sql = sql + separator;
		sql = sql + endLine + ' ADD ' + uniques;
	}
	if(indexes) { 
		if(constraints||uniques) sql = sql + separator;
		sql = sql + endLine + ' ADD ' + indexes;
	}
	
	//alter table add constraint add unique
	if(con)
	con.query(sql, function (err, result) {
		utils.appendFile(fileName, header + sql + endRow + endLine, function(){
		  if(err) responseError(err,callback);
		  else callback('constraints ' + entityName + ' created!!');
		});
	});
	else 
	utils.appendFile(fileName, header + sql + endRow + endLine, function(){
	  callback('constraints ' + entityName + ' created!!');
	});
}
function createTable(con,schema,entityName,callback){
	var header = '', keys = '', primarykeys = '', foreingKey = null,
		primarykeysList = listCreated[entityName].primarykeys, 
		foreingKeysList = listCreated[entityName].foreingKeys,
		columnHeaders = listCreated[entityName].columnHeaders;
	
	for(var pkIndx in primarykeysList){
		if(keys.length > 0) keys = keys + separator;
		keys = keys + primarykeysList[pkIndx];
	}
	primarykeys = keys.length > 0 ? separator + endLine + ' PRIMARY KEY ( ' + keys + ' )' : '';
	
	header = longLine + endLine;
	header = header + '-- Table ' + schema + '.' + entityName + endLine;
	header = header + longLine + endLine;

	var sql = 'CREATE TABLE IF NOT EXISTS '+schema+'.'+entityName+' (' + endLine;
		sql = sql + columnHeaders + primarykeys + endLine + ')';	
		sql = sql + ' ENGINE=InnoDB DEFAULT CHARSET=latin1';
	
	//create table in database
	if(con)
	con.query(sql, function (err, result) {
		utils.appendFile(fileName, header + sql + endRow + endLine + endLine, function(){
			callback('table '+ entityName + ' created!!',entityName);
		});
		if(err) responseError(err,callback);
	});
	else 
	utils.appendFile(fileName, header + sql + endRow + endLine + endLine, function(){
		callback('table '+ entityName + ' created!!',entityName);
	});

}

module.exports = {
	
	buildDatabase: function (connection,schema,user){
			
		var dateFile = Date.now();
		fileName = 'public/'+dateFile+'_'+schema+'.sql';
		var con = connection ? mysql.createConnection(connection) : null;
		 
		createUser(con,schema,user,function(result){
			if(result) console.log(result);
			createSchema(con,schema,function(result){
				if(result) console.log(result);
				//copy object
				var oldEntities = JSON.parse(JSON.stringify(Entities));
				for(var entity in Entities) createEntity(schema,entity);
				for(var entity in Entities) createTable(con,schema,entity,startCreateConstraint);
				
				function startCreateConstraint(result,createdEntity){
				    if(result) console.log(result);
				    delete oldEntities[createdEntity];
				    if(JSON.stringify(oldEntities) === '{}') {
					   for(var entity in Entities){
						   createConstraint(con,schema,entity,function(result){
							   if(result) console.log(result);
						   });
						}
				    }
				}
			});
		});
	}
};
