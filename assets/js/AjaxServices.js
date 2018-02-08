function AjaxServices(url,data,callback){
	var type = 'POST';
	
	if(typeof data === 'function'){
		type = 'GET';
		callback = data;
		data = null;
	}
	
	//console.log(JSON.stringify(data))
	$.ajax({
		url: url,
		type: type,
		dataType: "JSON",
		data: data
	}).done(function(response){
		if(response.status === 200) callback(false,response.data);
		else {
			callback(response);
		}
	}).fail(function(xhr, status, error){
		console.log(xhr);
		callback(error);
	})
}


var Services = {
	loginAuth: function(userName,userPassword,callback){
		AjaxServices('/login/auth', { 
			"action": "Login", 
			"userName": userName, 
			"userPassword" : userPassword 
		},callback);
	},
	logOut: function(callback){
		AjaxServices('/logOut', { 
			"action": "LogOut"
		},callback);
	},
	getModules: function (callback){
		AjaxServices('/services/modules',function(err,data){
			callback(err,data);
		},callback)
	},
	getEntity: function (entityName,input,callback){
		AjaxServices('/entity/'+entityName,input,function(err,data){
			callback(err,data);
		},callback)
	}
	
}
