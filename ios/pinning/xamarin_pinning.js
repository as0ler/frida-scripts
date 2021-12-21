var func = DebugSymbol.getFunctionByName("Security_Tls_MobileCertificateHelper_Validate_string_bool_Mono_Security_Interface_ICertificateValidator2_System_Security_Cryptography_X509Certificates_X509CertificateCollection");

send ("Attaching to Security_Tls_MobileCertificateHelper_Validate => "+func);

Interceptor.attach(func, {
  onEnter: function (args) {
    send("=> Function ChainValidation");
  },
    onLeave: function (retval) {
    send ("Retval - Bool: " + retval);
    if (retval == 0) {
      retval.replace(0x01);
      send ("HOOK => Modifying original return value of ChainValidation");
      send ("Retval - Bool: " + retval);
    }
  }
});


var func3 = DebugSymbol.getFunctionByName("Security_Tls_MobileCertificateHelper_InvokeSystemCertificateValidator_Mono_Security_Interface_ICertificateValidator2_string_bool_System_Security_Cryptography_X509Certificates_X509CertificateCollection_bool__Mono_Security_Interface_MonoSslPolicyErrors__int_");

send ("Attaching to Security_Tls_MobileCertificateHelper_InvokeSystemCertificateValidator_Mono_Security_Interface_ICertificateValidator2_string_bool_System_Security_Cryptography_X509Certificates_X509CertificateCollection_bool__Mono_Security_Interface_MonoSslPolicyErrors__int_ => "+func3);

Interceptor.attach(func3, {
  onEnter: function (args) {
    this.success = args[4];
    send("=> Function Security_Tls_MobileCertificateHelper_InvokeSystemCertificateValidator_Mono_Security_Interface_ICertificateValidator2_string_bool_System_Security_Cryptography_X509Certificates_X509CertificateCollection_bool__Mono_Security_Interface_MonoSslPolicyErrors__int_");
    send ("validator (Certvalidator)=> "+args[0]);
    send ("targetHost (string) => "+args[1]);
    send ("serverMode (bool) => "+args[2]);
    send ("certificates (x509)=> "+args[3]);
    send ("success_out (bool) => "+this.success);
    send ("errors (ref SSLPolicy) => "+args[5]);
    send ("status (ref int) => "+args[6]);
  },
    onLeave: function (retval) {
    send ("Retval InvokeSystemCertificateValidator - Bool: " + retval);
    var success_orig = Memory.readU8(this.success);
    send ("Reading Original Value from success => " + success_orig);
    if(success_orig == 0) {
      send ("HOOK => Modifying original value of success");
      Memory.writeU8(this.success, 0x01)
      send ("Reading Modified Value from success => " +  Memory.readU8(this.success));
    }
  }
});
