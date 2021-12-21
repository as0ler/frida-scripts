var jailbreakPaths = [
	"/etc/apt",
	"/Library/MobileSubstrate/MobileSubstrate.dylib",
	"/Applications/Cydia.app",
	"/Applications/blackra1n.app",
	"/Applications/FakeCarrier.app",
	"/Applications/Icy.app",
	"/Applications/IntelliScreen.app",
	"/Applications/MxTube.app",
	"/Applications/RockApp.app",
	"/Applications/SBSetttings.app",
	"/Applications/WinterBoard.app",
	"/usr/sbin/sshd",
	"/private/var/tmp/cydia.log",
	"/usr/binsshd",
	"/usr/libexec/sftp-server",
	"/Systetem/Library/LaunchDaemons/com.ikey.bbot.plist",
	"/System/Library/LaunchDaemons/com.saurik.Cy@dia.Startup.plist",
	"/Library/MobileSubstrate/MobileSubstrate.dylib",
	"/var/log/syslog",
	"/bin/bash",
	"/bin/sh",
	"/etc/ssh/sshd_config",
	"/usr/libexec/ssh-keysign"
        ];

if(ObjC.available) {
	send("Jailbreak Detection enabled");
	for(var className in ObjC.classes) {
	    if (ObjC.classes.hasOwnProperty(className)) {
					//Jailbreak detection via accessing special files
					if(className == "NSFileManager") {
					    send("Found our target class : " + className);

							var hook = ObjC.classes.NSFileManager["- fileExistsAtPath:"];
							Interceptor.attach(hook.implementation, {
							onEnter: function (args) {
								var  path = ObjC.Object(args[2]).toString(); // NSString

								this.jailbreakCall = false;
								var i = jailbreakPaths.length;
								while (i--) {
								    if (jailbreakPaths[i] == path) {
											send("Jailbreak detection => Trying to read path: "+path);
											this.jailbreakCall = true;
								    }
								}
						  },
							onLeave: function (retval) {
								if(this.jailbreakCall) {
									retval.replace(0x00);
									send("Jailbreak detection bypassed!");
								}
							}
						});
					}
					//Jailbreak detection via writing to forbidden paths
					if(className == "NSString") {
					    send("Found our target class : " + className);

							var hook = ObjC.classes.NSString["- writeToFile:atomically:encoding:error:"];
							Interceptor.attach(hook.implementation, {
							onEnter: function (args) {
								var  path = ObjC.Object(args[2]).toString(); // NSString
								//send("Path : " + path);

								if (path.indexOf("private") >= 0) {
											send("Jailbreak detection => Trying to write path: "+path);
											this.jailbreakCall = true;
											this.error = args[5];
								}
						  },
							onLeave: function (retval) {
								if(this.jailbreakCall) {
									var error = ObjC.classes.NSError.alloc();
									Memory.writePointer(this.error, error);
									send("Jailbreak detection bypassed!");
								}
						  }
						});
					}
					//Jailbreak detection via cydia URL Schema
					if(className == "UIApplication") {
					    send("Found our target class : " + className);

							var hook = ObjC.classes.UIApplication["- canOpenURL:"];
							Interceptor.attach(hook.implementation, {
							onEnter: function (args) {
								var  url = ObjC.Object(args[2]).toString(); // NSString
								send("URL : " + url);

								if (url.indexOf("cydia") >= 0) {
											send("Jailbreak detection => Trying to use Cydia URL Schema: "+url);
											this.jailbreakCall = true;
								}
						  },
							onLeave: function (retval) {
								if(this.jailbreakCall) {
									retval.replace(0x00);
									send("Jailbreak detection bypassed!");
								}
						  }
						});
					}
	    }
	}
} else {
	console.log("Objective-C Runtime is not available!");
}
