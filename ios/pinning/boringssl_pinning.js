/* Description: iOS 13 SSL Bypass based on https://codeshare.frida.re/@federicodotta/ios13-pinning-bypass/
and https://medium.com/@macho_reverser/bypassing-certificate-pinning-on-ios-12-with-frida-809acdb875e7
 */

const commands = {
	'disable_ssl_pinning':disablePinning
};

r2frida.pluginRegister('sslpinning', function (name) {
	return commands[name];
});

async function disablePinning (args) {
    try {
        Module.ensureInitialized("libboringssl.dylib");
    } catch(err) {
        console.log("libboringssl.dylib module not loaded. Trying to manually load it.")
        Module.load("libboringssl.dylib");	
    }

    var SSL_VERIFY_NONE = 0;
    var ssl_set_custom_verify;
    var ssl_get_psk_identity;	

    ssl_set_custom_verify = new NativeFunction(
        Module.findExportByName("libboringssl.dylib", "SSL_set_custom_verify"),
        'void', ['pointer', 'int', 'pointer']
    );

    ssl_get_psk_identity = new NativeFunction(
        Module.findExportByName("libboringssl.dylib", "SSL_get_psk_identity"),
        'pointer', ['pointer']
    );

    function custom_verify_callback_that_does_not_validate(ssl, out_alert){
        return SSL_VERIFY_NONE;
    }

    var ssl_verify_result_t = new NativeCallback(function (ssl, out_alert){
        custom_verify_callback_that_does_not_validate(ssl, out_alert);
    },'int',['pointer','pointer']);

    Interceptor.replace(ssl_set_custom_verify, new NativeCallback(function(ssl, mode, callback) {
        ssl_set_custom_verify(ssl, mode, ssl_verify_result_t);
    }, 'void', ['pointer', 'int', 'pointer']));

    Interceptor.replace(ssl_get_psk_identity, new NativeCallback(function(ssl) {
        return "notarealPSKidentity";
    }, 'pointer', ['pointer']));       
}