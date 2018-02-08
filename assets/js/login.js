
var CloudSkol = angular.module('CloudSkol', []);

CloudSkol.controller('index', ['$scope','$window','services',function($scope,$window,services) {
	var languageBtn = $('#traslateSubmitModal');
	languageBtn.on('click', function(ev) {
		var lang = $("#traslateSelected").val();
		setTraslate(lang);
	});
	
	function setTraslate(lang){
		services.getTraslate(lang,function(err,traslate){
		  $scope.view = traslate;
		});	
	}
	$scope.onTraslate = function(lang){
		setTraslate(lang);
	}
	var lang = $window.navigator.language || $window.navigator.userLanguage;
	    lang = lang.split('-') ? lang.split('-')[0] : lang;
	//setTraslate(lang);
	
	services.getTraslate(lang,function(err,traslate){
	  $scope.view = traslate;
	  $loginMessage = Message('#login-message',traslate.traslate);
	  $('#idLogInBtn').click(function(){ValidatorLoginForm(services)});
    });
}]);

function ValidatorLoginForm(services) {
	var userName = $('#userNameInput').val();
	var userPassword = $('#userPasswordInput').val();
	
	if(userName.length > 0 ) {
	  if(userPassword.length > 0){
			var userPasswordHex = Utils.encrypt(userPassword);
			services.loginAuth(userName,userPasswordHex,function(err,response){
				console.log(response);
				if(err){
					$loginMessage.show('danger',err.status,err.message);
				}
				else if(response==='success'){ location = '/'; }
				else {
					$loginMessage.show('danger',err.status,err.message);
				}
			});
		
		}
		else {
			var message = "PasswordRequired";
			$loginMessage.show('danger',701,message);
		}
	}
	else {
		var message = "UserNameRequired";
		$loginMessage.show('danger',701,message);
	}
}
