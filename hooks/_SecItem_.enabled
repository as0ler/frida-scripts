var className = "Security";
var hookMethods = ["SecItemAdd", "SecItemUpdate", "SecItemDelete"];

for (index = 0; index < hookMethods.length; index++) {
	var methodName = hookMethods[index];
	var ptr = null;
	Module.enumerateExports(className, {
		onMatch: function(imp) {
			if (imp.type == "function" && imp.name == methodName) {
				send("Found target method : " + methodName);

				try {
					Interceptor.attach(ptr(imp.address), {
						onEnter: function(args) {
							send("[+] Keychain operation: " + imp.name);
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
								send("\t-   " + k + "=" + v);
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
