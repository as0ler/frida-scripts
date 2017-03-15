var className = "NSUserDefaults";
var hookMethods = ["- setObject:forKey:", "- setURL:forKey:", "- setInteger:forKey:", "- setFloat:forKey:", "- setDouble:forKey:"];

if(ObjC.available) {
	for(var c in ObjC.classes) {
	    if (ObjC.classes.hasOwnProperty(c)) {
		if (c == className) {
		    	send("Found target class : " + className);

			var methods = ObjC.classes.NSUserDefaults.$methods;
			hookMethods.forEach(function(m) {
				var hook = ObjC.classes.NSUserDefaults[m];	
				Interceptor.attach(hook.implementation, {
					onEnter: function(args) {
						send("[+][" + className + "][" + m + "]");

						var obj = ObjC.Object(args[3]);
						send("\t- Default Name: " + obj.toString());

						var obj = ObjC.Object(args[2]);
						send("\t- Value: " + obj.toString());
					}
				});
			});
		}
	    }
	}
} else {
	console.log("Objective-C Runtime is not available!");
}
