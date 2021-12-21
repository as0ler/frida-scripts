// Collected certificates
var collectedCertificates = [];

// CC_SHA256()
var CC_SHA256 = new NativeFunction(
    Module.getExportByName('Security', 'CC_SHA256'), 'uint64', ['pointer', 'uint64', 'pointer']
);

// Calculate a SHA256 hash
function calcSHA256(buffer, bufferLength) {
    var hash = Memory.alloc(32);
    CC_SHA256(buffer, bufferLength, hash);
    var hashBytes = hash.readByteArray(32);
    return toHexString(hashBytes);
}

// Convert a byte array buffer to hex string
function toHexString(buffer) { // buffer is an ArrayBuffer
    var byteArray = new Uint8Array(buffer);
    var s = '';
    for(var i = 0; i < byteArray.length; i++) {
        s += ('0' + (byteArray[i] & 0xFF).toString(16)).slice(-2);
    }
    return s;
}

// Get SecCertificateCreateWithBytes pointer
var SecCertificateCreateWithBytes_prt = Module.findExportByName("Security", "SecCertificateCreateWithBytes");

// SecCertificateCreateWithBytes()
var SecCertificateCreateWithBytes= new NativeFunction(
    SecCertificateCreateWithBytes_prt, "pointer", ["pointer", "pointer", "uint64"]
);

// Catch the certificates
function catchCertificates() {
    // Hook SecCertificateCreateWithBytes()
    Interceptor.replace(SecCertificateCreateWithBytes_prt, new NativeCallback(function(something, certAddress, certLength) {
        var hash = calcSHA256(certAddress, certLength);
        if (collectedCertificates.indexOf(hash) < 0) {
            collectedCertificates.push(hash);
            send(hash, certAddress.readByteArray(certLength));
        }
        return SecCertificateCreateWithBytes(something, certAddress, certLength);
    }, "pointer", ["pointer", "pointer", "uint64"]));
    send("[*] SecCertificateCreateWithBytes(...) hooked!");
}
catchCertificates();
