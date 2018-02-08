function lpad(text,base,charset) {
	length = (parseInt(text.length / base,0)  + 1 )* base;
	var textStr = text;
	for(var i=0; i<(length - text.length);i++) {
		textStr = charset + textStr;
	}
	return textStr;
}
var Utils = {
	
 encrypt: function(text){
	
	// decrypt 256-bit key (32 bytes * 8 bits/byte = 256 bits)	
	var key = aesjs.utils.utf8.toBytes("008aaadf01172f34dbd29e80a823cef2");
	 
	// The initialization vector (must be 16 bytes) 
	var iv = aesjs.utils.utf8.toBytes("008fffd119971f34");
	
	// Convert text to bytes (text must be a multiple of 16 bytes) 
	var text = lpad(text,16,' ');
	
	var textBytes = aesjs.utils.utf8.toBytes(text);
	 
	//var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
	//var encryptedBytes = aesCbc.encrypt(textBytes);
	var segmentSize = 8;
	var aesCfb = new aesjs.ModeOfOperation.cfb(key, iv, segmentSize);
	var encryptedBytes = aesCfb.encrypt(textBytes);
	 
	// To print or store the binary data, you may convert it to hex 
	var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
	
	return encryptedHex;
 }
}


