if(ObjC.available) {
	for(var className in ObjC.classes) {
	    if (ObjC.classes.hasOwnProperty(className)) {
		if(className == "NSString") {
		    	send("Found target class : " + className);

			var hook = ObjC.classes.NSString["- "];
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
		}
	    }
	}
} else {
console.log("Objective-C Runtime is not available!");
}
