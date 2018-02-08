var Message = function(selector,traslate){
	var message = $(selector);
	function hidden(){
		message.css('display','none');	
	}
	hidden();
	return {
		show : function(type,status,text){
			//message.html(template);
			message.find('button').click(function(){
				message.css('display','none');
			});
			message.find('strong[id="status"]').text(status);
			if(traslate){
				text = traslate[text] ? traslate[text] : text;
			}
			message.find('span[id="message"]').text(text);
			message.removeClass('alert-success alert-info alert-warning alert-danger');
			message.addClass('alert-'+type);
			message.alert().show();
		},
		hidden : function(){
				hidden();
			}
	}
}