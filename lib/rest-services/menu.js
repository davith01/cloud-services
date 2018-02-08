/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict';

var utils = require('../utils'),
	user = require('../mysql/user');

function retriveModule(href,modules,callback){
	var action = null, module = null;
	if(href)
	for(var module in modules){
		for(var action in modules[module]){
			if(modules[module][action].href === href){
				callback(module,action);
			}
		}
	}
}
	
//validate module and action in working group permissions
function validatorModule(module,action,workingGroups){
	if(module && workingGroups){
		for(var i=0; i<workingGroups.length; i++){
			if(workingGroups[i].permissions){
				if(workingGroups[i].permissions[module]){
					for(var j=0; j<workingGroups[i].permissions[module].length;j++){
						if(workingGroups[i].permissions[module][j]===action){
							return true;
						}
					}	
				}
			}
		}	
	}
	return false;
};
	
function searchItem(list,data,attr){
	if(list) {
		var _item = list.filter(function(item, index){
			return item.label === data.label;
		});
		
		if(_item.length > 0) return _item[0];
		_item = { "label": data.label, "icon": data.icon };
		_item[attr] = [];
		if(data.href) _item.href = data.href;
		list.push(_item);
	}
	return _item;
}

var menuSystem = {
	
	getMenuByUser: function(req,callback) {
		
		var section = null, menuSide = [],
			href = null, module = null, action = null,
			_section = null, _sideMenu = null, _childMenu = null, _subChildMenu = null;
		
		/*
		Structure of classes css to menu
		  sections -> sideMenu -> childMenu -> subChildMenu -> href
		  sections -> sideMenu -> childMenu ->  href
		  sections -> sideMenu -> href
		*/

		user.getWorkingGroups(req,function(err,workingGroups){
			
			utils.loadFile('modules.json',function(err,modules){
				
				utils.loadFile('menu-side.json',function(err,sections){
					
						section = sections.sections;
						
						for(var i=0;i<section.length;i++){
						if(section[i]['sideMenu'])
						for(var j=0;j<section[i]['sideMenu'].length;j++){
							href = section[i]['sideMenu'][j]['href'];
							retriveModule(href,modules,function(module,action){
								if(validatorModule(module,action,workingGroups)){
									_section = searchItem(menuSide,section[i],'sideMenu');
									_sideMenu = searchItem(_section.sideMenu,section[i]['sideMenu'][j],'href');
								}
							});
							
						if(section[i]['sideMenu'][j]['childMenu'])
						for(var k=0;k<section[i]['sideMenu'][j]['childMenu'].length;k++){
							href = section[i]['sideMenu'][j]['childMenu'][k]['href'];
							retriveModule(href,modules,function(module,action){
								if(validatorModule(module,action,workingGroups)){
									_section = searchItem(menuSide,section[i],'sideMenu');
									_sideMenu = searchItem(_section.sideMenu,section[i]['sideMenu'][j],'childMenu');
									_childMenu = searchItem(_sideMenu.childMenu,section[i]['sideMenu'][j]['childMenu'][k],'href');
									
								}
							});	
						if(section[i]['sideMenu'][j]['childMenu'][k]['subChildMenu'])	
						for(var l=0;l<section[i]['sideMenu'][j]['childMenu'][k]['subChildMenu'].length;l++){
							href = section[i]['sideMenu'][j]['childMenu'][k]['subChildMenu'][l]['href'];					
							retriveModule(href,modules,function(module,action){
								if(validatorModule(module,action,workingGroups)){
									_section = searchItem(menuSide,section[i],'sideMenu');
									_sideMenu = searchItem(_section.sideMenu,section[i]['sideMenu'][j],'childMenu');
									_childMenu = searchItem(_sideMenu.childMenu,section[i]['sideMenu'][j]['childMenu'][k],'subChildMenu');
									_subChildMenu = searchItem(_childMenu.subChildMenu,section[i]['sideMenu'][j]['childMenu'][k]['subChildMenu'][l],'href');
								}
							});
						}}}}
						callback(err,{"sections": menuSide},modules,workingGroups);
				});
			});
		});
	}
};

module.exports = menuSystem;
