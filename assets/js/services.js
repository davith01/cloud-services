
CloudSkol.factory('services', function servicesFactory($http) {
	
	function PostServices(url,data,callback){
		$http.post(url,data)
		.then(function(response){
				response = response.data ? response.data : response;
				if(response.status===200){
					callback(false,response.data);
				}
				else callback(response);
			 },
			 function(err){ callback(err);})
	}
	function GetServices(url,callback){
		$http.get(url)
		.then(function(response){
				response = response.data ? response.data : response;
				if(response.status===200){
					callback(false,response.data);
				}
				else callback(response);
			 },
			 function(err){
				 callback(err);})
	}
	
	var resources = {
		getTraslate : function(lang,callback){
			GetServices('/traslate/' + lang,callback);
		},
		setTraslate : function(lang,callback){
			PostServices('/traslate/' + lang,{
				"lang": lang
			},callback);
		},
		loginAuth: function(userName,userPassword,callback){
			PostServices('/login/auth', {
				"userName": userName,
				"userPassword": userPassword,
				"action" : "Login"
			},callback);
		},
		getModules : function (callback){
			GetServices('/modules',callback);
		}
	}
	return resources;
 });