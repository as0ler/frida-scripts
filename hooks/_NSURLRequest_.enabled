if(ObjC.available) {
	for(var className in ObjC.classes) {
	    if (ObjC.classes.hasOwnProperty(className)) {
		//Connection
			if(className == "NSURLConnection") {
				send("Found target class : " + className);
				var hook = ObjC.classes.NSURLConnection["- start"];
				Interceptor.attach(hook.implementation, {
					onEnter: function(args) {
					send("HTTP Request sent! [NSURLConnection start]");
					}
				});
				var hook = ObjC.classes.NSURLConnection["- initWithRequest:delegate:startImmediately:"];
				Interceptor.attach(hook.implementation, {
					onEnter: function(args) {
					send("HTTP Request sent! [NSURLConnection initWithRequest:startImmediately] (Deprecated at iOS 9.0)");
					}
				});
				var hook = ObjC.classes.NSURLConnection["- initWithRequest:delegate:"];
				Interceptor.attach(hook.implementation, {
					onEnter: function(args) {
					send("HTTP Request sent! [NSURLConnection initWithRequest] (Deprecated at iOS 9.0)");
					}
				});
				var hook = ObjC.classes.NSURLConnection["+ connectionWithRequest:delegate:"];
				Interceptor.attach(hook.implementation, {
					onEnter: function(args) {
					send("HTTP Request sent! [NSURLConnection connectionWithRequest] (Deprecated at iOS 9.0)");
					}
				});
				var hook = ObjC.classes.NSURLConnection["+ sendSynchronousRequest:returningResponse:error:"];
				Interceptor.attach(hook.implementation, {
					onEnter: function(args) {
					send("HTTP Request sent! [NSURLConnection sendSynchronousRequest] (Deprecated at iOS 9.0)");
					}
				});
				var hook = ObjC.classes.NSURLConnection["+ sendAsynchronousRequest:queue:completionHandler:"];
				Interceptor.attach(hook.implementation, {
					onEnter: function(args) {
					send("HTTP Request sent! [NSURLConnection sendAsynchronousRequest] (Deprecated at iOS 9.0)");
					}
				});

			}
		//Getting URL GET Requests
			if(className == "NSURLRequest") {
				send("Found our target class : " + className);
				var hook = ObjC.classes.NSURLRequest["+ requestWithURL:"];
				Interceptor.attach(hook.implementation, {
					onEnter: function(args) {
					var receiver = new ObjC.Object(args[0]);
					var sel = ObjC.selectorAsString(args[1]);
					var obj = ObjC.Object(args[2]);
					send("HTTP Request [ "+receiver+" "+sel+" ] => NSURL: " + obj.toString());
					}
				});
			}
		//Getting URL POST Requests
			if(className == "NSMutableURLRequest") {
				send("Found our target class : " + className);
				//Getting URL
				var hook = ObjC.classes.NSMutableURLRequest["+ requestWithURL:"];
				Interceptor.attach(hook.implementation, {
					onEnter: function(args) {
					var receiver = new ObjC.Object(args[0]);
					var sel = ObjC.selectorAsString(args[1]);
					var obj = ObjC.Object(args[2]);
					send("HTTP Request [ "+receiver+" "+sel+" ] => NSURL: " + obj.toString());
					}
				});
				//Getting POST Data
				var hook = ObjC.classes.NSMutableURLRequest["- setHTTPBody:"];
				Interceptor.attach(hook.implementation, {
					onEnter: function(args) {
					var receiver = new ObjC.Object(args[0]);
					var sel = ObjC.selectorAsString(args[1]);
					var data = ObjC.Object(args[2]);
					var string = ObjC.classes.NSString.alloc();
					send(" HTTP Request via [ "+receiver+" "+sel+" ] => DATA: " + string.initWithData_encoding_(data,4));
					}
				});
				var hook = ObjC.classes.NSMutableURLRequest["- setHTTPBodyStream:"];
				Interceptor.attach(hook.implementation, {
					onEnter: function(args) {
					var receiver = new ObjC.Object(args[0]);
					var sel = ObjC.selectorAsString(args[1]);
					var data = ObjC.Object(args[2]);
					var string = ObjC.classes.NSString.alloc();
					send(" HTTP Request via [ "+receiver+" " +sel+" ] => DATA: " + string.initWithData_encoding_(data,4));
					}
				});
			}

	    }
	}
} else {
console.log("Objective-C Runtime is not available!");
}
