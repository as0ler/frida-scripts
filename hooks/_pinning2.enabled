if (ObjC.available) {
  var className = "Security";
  var ptr = null;

  Module.enumerateExports(className, {
    onMatch: function(imp) {
      if (imp.type == "function" && imp.name == "SSLHandshake") {
        try  {
          Interceptor.attach(ptr(imp.address), {
            onEnter: function(args) {
              send ("Hooked SSLHandshake");
              this.sslContext = args[0];
            },
            onLeave: function(retval) {
              //errSSLServerAuthCompleted == -9841
              send("[DEBUG] Return value: "+retval);
              if(retval ==  0xffffd98f) {
                send("Return value == errSSLServerAuthCompleted");
                var func_ptr = Module.findExportByName('Security', 'SSLHandshake');
                var my_function = new NativeFunction(ptr(func_ptr), 'int', ['pointer']);
                //OSStatus SSLHandshake (SSLContextRef context)
                send("Calling SSLHandshake again");
                retval.replace(0x00);
                my_function(this.sslContext);
              }
            }
          });
        } catch (error) {
          console.log("Ignoring " + imp.name + ": " + error.message);
        }
      }

      if (imp.type == "function" && imp.name == "SSLSetSessionOption") {
        try  {
          Interceptor.attach(ptr(imp.address), {
            onEnter: function(args) {
              send ("Hooking SSLSetSessionOption");
              //SSLSetSessionOption (SSLContextRef context, SSLSessionOption option, Boolean value) {
              //kSSLSessionOptionBreakOnServerAuth = 0
              if (args[1] == 0) {
                this.hooked = true;
              }
            },
            onLeave: function(retval) {
              if(this.hooked) {
                send("Modifying return value to noErr");
                retval.replace(0);
              }
            }
          });
        } catch (error) {
          console.log("Ignoring " + imp.name + ": " + error.message);
        }
      }

      if (imp.type == "function" && imp.name == "SSLCreateContext"){
        try  {
          Interceptor.attach(ptr(imp.address), {
            onEnter: function(args) {
              send ("Hooking SSLCreateContext");
              //SSLCreateContext (CFAllocatorRef alloc,SSLProtocolSide protocolSide,SSLConnectionType connectionType);
            },
            onLeave: function(retval) {
              var sslContext = retval;
              var func_ptr = Module.findExportByName('Security', 'SSLSetSessionOption');
              var my_function = new NativeFunction(ptr(func_ptr), 'pointer', ['pointer', 'int', 'int']);
              //kSSLSessionOptionBreakOnServerAuth = 0
              //SSLSetSessionOption(sslContext, kSSLSessionOptionBreakOnServerAuth, true);
              send("Calling function SSLSetSessionOption(sslContext,kSSLSessionOptionBreakOnServerAuth,true");
              my_function(sslContext, 0 , 1);
            }
          });
        } catch (error) {
          console.log("Ignoring " + imp.name + ": " + error.message);
        }
      }
    },
    onComplete: function (e) {
      send("Certificate Pinning Hooked");
    }
  });
}
