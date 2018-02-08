/*!
 * cloud-services express MVC framework
 * MIT Licensed
 */
 
'use strict';

var aesjs = require('aes-js');
	
var base128Encrypt = {
		
		decrypt: function(encryptedHex) {
			// decrypt 256-bit key (32 bytes * 8 bits/byte = 256 bits)	
			var key = aesjs.utils.utf8.toBytes("008aaadf01172f34dbd29e80a823cef2");
			 
			// The initialization vector (must be 16 bytes) 
			var iv = aesjs.utils.utf8.toBytes("008fffd119971f34");
			 
			// When ready to decrypt the hex string, convert it back to bytes 
			var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
			 
			// The cipher-block chaining mode of operation maintains internal 
			// state, so to decrypt a new instance must be instantiated. 
			//var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
			//var decryptedBytes = aesCbc.decrypt(encryptedBytes);
			var aesCfb = new aesjs.ModeOfOperation.cfb(key, iv, 8);
			var decryptedBytes = aesCfb.decrypt(encryptedBytes);
			
			 
			// Convert our bytes back into text
			var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
			
			return decryptedText;
		}

};

module.exports = base128Encrypt;
