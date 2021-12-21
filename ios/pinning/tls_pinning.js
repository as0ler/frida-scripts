var tls_helper_create_peer_trust;
var nw_tls_create_peer_trust;
var version = ObjC.classes.UIDevice.currentDevice().systemVersion().toString();

/* OSStatus nw_tls_create_peer_trust(tls_handshake_t hdsk, bool server, SecTrustRef *trustRef); */
	nw_tls_create_peer_trust = new NativeFunction(
		Module.findExportByName(null, "nw_tls_create_peer_trust"),
		'int', ['pointer', 'bool', 'pointer']
	);
/* OSStatus tls_helper_create_peer_trust(tls_handshake_t hdsk, bool server, SecTrustRef *trustRef); */
    tls_helper_create_peer_trust = new NativeFunction(
    Module.findExportByName(null, "tls_helper_create_peer_trust"),
    'int', ['pointer', 'bool', 'pointer']
    );

var errSecSuccess = 0;

Interceptor.replace(nw_tls_create_peer_trust, new NativeCallback(function(hdsk, server, trustRef) { 
    return errSecSuccess;
    }, 'int', ['pointer', 'bool', 'pointer']));

Interceptor.replace(tls_helper_create_peer_trust, new NativeCallback(function(hdsk, server, trustRef) { 
    return errSecSuccess;
    }, 'int', ['pointer', 'bool', 'pointer']));
console.log("TLS certificate validation bypass active");
