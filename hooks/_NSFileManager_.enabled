if(ObjC.available) {
	for(var className in ObjC.classes) {
	    if (ObjC.classes.hasOwnProperty(className)) {
		if(className == "NSFileManager") {
		    	send("Found target class : " + className);

			var hook = ObjC.classes.NSFileManager["- createFileAtPath:contents:attributes:"];
			Interceptor.attach(hook.implementation, {
			    onEnter: function(args) {
				var obj = ObjC.Object(args[2]);
				send("[+][NSFileManager] create File at: " + obj.toString());

				var obj = ObjC.Object(args[3]);
				var string = ObjC.classes.NSString.alloc();
				send("\t- Content : " + string.initWithData_encoding_(obj,4));

				var obj = ObjC.Object(args[4]);
				send("\t- Attributes : " + obj.toString());
			    }
			});
			var hook = ObjC.classes.NSFileManager["- copyItemAtPath:toPath:error:"];
			Interceptor.attach(hook.implementation, {
			    onEnter: function(args) {
				var obj = ObjC.Object(args[2]);
				send("[+][NSFileManager] copy File at: " + obj.toString());

				var obj = ObjC.Object(args[3]);
				send("\t- To Path : " + obj.toString());
			    }
			});
			var hook = ObjC.classes.NSFileManager["- moveItemAtPath:toPath:error:"];
			Interceptor.attach(hook.implementation, {
			    onEnter: function(args) {
				var obj = ObjC.Object(args[2]);
				send("[+][NSFileManager] move File at: " + obj.toString());

				var obj = ObjC.Object(args[3]);
				send("\t- To Path : " + obj.toString());
			    }
			});
			var hook = ObjC.classes.NSFileManager["- fileExistsAtPath:"];
			Interceptor.attach(hook.implementation, {
			    onEnter: function(args) {
						var obj = ObjC.Object(args[2]);
						send("[+][NSFileManager] File Exists at Path: " + obj.toString());
					}
			});
			var hook = ObjC.classes.NSFileManager["- isReadableFileAtPath:"];
			Interceptor.attach(hook.implementation, {
			    onEnter: function(args) {
						var obj = ObjC.Object(args[2]);
						send("[+][NSFileManager] File Path: " + obj.toString());
					},
				onExit: function(retval) {
						send("- isReadable? " + retval.toString());
					}
			});
			var hook = ObjC.classes.NSFileManager["- isWritableFileAtPath:"];
			Interceptor.attach(hook.implementation, {
			    onEnter: function(args) {
						var obj = ObjC.Object(args[2]);
						send("[+][NSFileManager] File Path: " + obj.toString());
					},
				onExit: function(retval) {
						send("- isWritable? " + retval.toString());
					}
			});
			var hook = ObjC.classes.NSFileManager["- isExecutableFileAtPath:"];
			Interceptor.attach(hook.implementation, {
			    onEnter: function(args) {
						var obj = ObjC.Object(args[2]);
						send("[+][NSFileManager] File Path: " + obj.toString());
					},
				onExit: function(retval) {
						send("- isExecutable? " + retval.toString());
					}
			});
			var hook = ObjC.classes.NSFileManager["- isDeletableFileAtPath:"];
			Interceptor.attach(hook.implementation, {
			    onEnter: function(args) {
						var obj = ObjC.Object(args[2]);
						send("[+][NSFileManager] File Path: " + obj.toString());
					},
				onExit: function(retval) {
						send("- isDeletable? " + retval.toString());
					}
			});
		}
	    }
	}
} else {
console.log("Objective-C Runtime is not available!");
}
