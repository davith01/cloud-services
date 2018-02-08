/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict';

var utils = require('../utils');
	
module.exports = {

	getTraslate: function (req,res){
		var lang =  req.params.lang || 'es';
		var traslate = utils.loadFileSync('traslate/'+lang+ '.json');
		res.header('Content-Type', 'text/json').send({"status":200,"data":traslate});
	},
	setTraslate: function (req,res){
		var lang =  req.params.lang || 'es';
		var traslate = utils.loadFileSync('traslate/'+lang+ '.json');
		res.header('Content-Type', 'text/json').send({"status":200,"data":traslate});
	}
};
