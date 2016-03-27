import frida
import sys


def on_message(message, data):
    try:
        if message:
            print("[*] {0}".format(message["payload"]))
    except Exception as e:
        print(message)
        print(e)


def do_hook():

    # $methods: array containing native method names exposed by this object

    hook = """
	var className = "Security";
	var hookMethods = ["SecItemAdd", "SecItemUpdate", "SecItemDelete"];

	for (index = 0; index < hookMethods.length; index++) {
		var methodName = hookMethods[index];
		send("Hooking class : " + className);
	    
		var ptr = null;
		Module.enumerateExports(className, { 
			onMatch: function(imp) {
				if (imp.type == "function" && imp.name == methodName) {
					send("Found target method : " + methodName);
				
					try {
						Interceptor.attach(ptr(imp.address), {
							onEnter: function(args) { 
								send("Hooking method : " + imp.name);
								var params = ObjC.Object(args[0]); // CFDictionaryRef => NSDictionary
								var keys = params.allKeys();
								for (index = 0; index < keys.count(); index++) {
									var k = keys.objectAtIndex_(index);
									var v = params.objectForKey_(k);
									if (k == "v_Data") {
										var string = ObjC.classes.NSString.alloc();
										v = string.initWithData_encoding_(v,4).toString();
									}
									if (k == "pdmn") {
										if (v == "ak") { 
											v = "kSecAttrAccessibleWhenUnlocked";
										} else if (v == "ck") {
											v = "kSecAttrAccessibleAfterFirstUnlock";
										} else if (v == "dk") {
											v = "kSecAttrAccessibleAlways";
										} else if (v == "aku") {
											v = "kSecAttrAccessibleWhenUnlockedThisDeviceOnly"
										} else if (v == "cku") {
											v = "kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly";
										} else {
											// v == dku
											v = "kSecAttrAccessibleAlwaysThisDeviceOnly";
										} 
									} 
									send("   " + k + "=" + v);
								}
							}
						});
					} catch (error) {
						console.log("Ignoring " + imp.name + ": " + error.message);
					}
				}
			},
			onComplete: function (e) {
					send("All methods loaded");
			}
		});
	}
	"""
    return hook

if __name__ == '__main__':
    try:
        session = frida.get_usb_device().attach(str(sys.argv[1]))
        script = session.create_script(do_hook())
        script.on('message', on_message)
        script.load()
        sys.stdin.read()
    except KeyboardInterrupt:
        sys.exit(0)
