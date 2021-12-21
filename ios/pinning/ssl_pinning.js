var errSSLServerAuthCompleted = -9481;
var kSSLSessionOptionBreakOnServerAuth = 0;
var noErr = 0;
var SSLHandshake = new NativeFunction(
    Module.findExportByName("Security", "SSLHandshake"),
    'int',
    ['pointer']
);
Interceptor.replace(SSLHandshake, new NativeCallback(function (context) {
    var result = SSLHandshake(context);
    if (result == errSSLServerAuthCompleted) {
        send("Replacing SSLHandshake");
        return SSLHandshake(context);
    }
    return result;
}, 'int', ['pointer']));
var SSLCreateContext = new NativeFunction(
    Module.findExportByName("Security", "SSLCreateContext"),
    'pointer',
    ['pointer', 'int', 'int']
);
Interceptor.replace(SSLCreateContext, new NativeCallback(function (alloc, protocolSide, connectionType) {
    send("Replacing SSLCreateContext");
    var sslContext = SSLCreateContext(alloc, protocolSide, connectionType);
    SSLSetSessionOption(sslContext, kSSLSessionOptionBreakOnServerAuth, 1);
    return sslContext;
}, 'pointer', ['pointer', 'int', 'int']));
var SSLSetSessionOption = new NativeFunction(
    Module.findExportByName("Security", "SSLSetSessionOption"),
    'int',
    ['pointer', 'int', 'bool']
);
Interceptor.replace(SSLSetSessionOption, new NativeCallback(function (context, option, value) {
    if (option == kSSLSessionOptionBreakOnServerAuth) {
        send("Replacing SSLSetSessionOption");
        return noErr;
    }
    return SSLSetSessionOption(context, option, value);
}, 'int', ['pointer', 'int', 'bool']));
