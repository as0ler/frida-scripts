'use strict';

const nativeFuncs = [ 
	"access",
	"lstat"
];

const jailbreakPaths = [
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
	"/var/log/syslog",
	"/bin/bash",
	"/bin/sh",
	"/etc/ssh/sshd_config",
	"/usr/libexec/ssh-keysign",
	"/Library/MobileSubstrate/DynamicLibraries/LiveClock.plist",
	"/Library/MobileSubstrate/DynamicLibraries/Veency.plist",
	"/private/var/lib/apt",
	"/private/var/lib/apt/",
	"/private/var/lib/cydia",
	"/private/var/mobile/Library/SBSettings/Themes",
	"/private/var/stash",
	"/System/Library/LaunchDaemons/com.ikey.bbot.plist",
	"/System/Library/LaunchDaemons/com.saurik.Cydia.Startup.plist",
	"/usr/libexec/sftp-server",
	"/Library/dpkg/info/kjc.checkra1n.mobilesubstraterepo.list"
    ];


function disableJB() {
	bypassNativeFuncs ();
	if(ObjC.available) {
		console.log("Jailbreak Detection enabled");
		for(let className in ObjC.classes) {
			if (ObjC.classes.hasOwnProperty(className)) {
						//Jailbreak detection via accessing special files
						if(className == "NSFileManager") {
							console.log("Found our target class : " + className);
							let hook = ObjC.classes.NSFileManager["- fileExistsAtPath:"];
								Interceptor.attach(hook.implementation, {
								onEnter: function (args) {
									let  path = ObjC.Object(args[2]).toString(); // NSString
									this.jailbreakCall = false;
									let i = jailbreakPaths.length;
									while (i--) {
										let splittedJbPath = jailbreakPaths[i].split('/');	
										let forbiddenBinary = "invalid";
										if (splittedJbPath.length > 0) {
											forbiddenBinary = splittedJbPath[splittedJbPath.length - 1];
										}
										if (jailbreakPaths[i] == path || (forbiddenBinary.length > 0 && path.includes(forbiddenBinary))) {
											console.log(`Jailbreak detection => Trying to read forbidden path: ${path}`);
												this.jailbreakCall = true;
										}
									}
							},
								onLeave: function (retval) {
									if(this.jailbreakCall) {
										retval.replace(0x00);
										console.log("Jailbreak detection bypassed!");
									}
								}
							});
						}
						//Jailbreak detection via writing to forbidden paths
						if(className == "NSString") {
							console.log("Found our target class : " + className);

							let hook = ObjC.classes.NSString["- writeToFile:atomically:encoding:error:"];
								Interceptor.attach(hook.implementation, {
								onEnter: function (args) {
									let  path = ObjC.Object(args[2]).toString(); // NSString

									if (path.indexOf("private") >= 0) {
										console.log("Jailbreak detection => Trying to write path: "+path);
												this.jailbreakCall = true;
												this.error = args[5];
									}
							},
								onLeave: function (retval) {
									if(this.jailbreakCall) {
										let error = ObjC.classes.NSError.alloc();
										Memory.writePointer(this.error, error);
										console.log("Jailbreak detection bypassed!");
									}
							}
							});
						}
						//Jailbreak detection via cydia URL Schema
						if(className == "UIApplication") {
							console.log("Found our target class : " + className);

								let hook = ObjC.classes.UIApplication["- canOpenURL:"];
								Interceptor.attach(hook.implementation, {
								onEnter: function (args) {
									let  url = ObjC.Object(args[2]).toString(); // NSString
									console.log("URL : " + url);

									if (url.indexOf("cydia") >= 0) {
										console.log("Jailbreak detection => Trying to use Cydia URL Schema: "+url);
										this.jailbreakCall = true;
									}
							},
								onLeave: function (retval) {
									if(this.jailbreakCall) {
										retval.replace(0x00);
										console.log("Jailbreak detection bypassed!");
									}
							}
							});
						}
			}
		}
	} else {
		console.log("Objective-C Runtime is not available!");
	}
}

function bypassNativeFuncs () {
	nativeFuncs.forEach(function(nativeFunc) {
		Interceptor.attach(Module.findExportByName("libSystem.B.dylib", nativeFunc), {
			onEnter: function (args) {
				let path = Memory.readCString(ptr(args[0]));
				let i = jailbreakPaths.length;
				while (i--) {
					if (jailbreakPaths[i] == path) {
						console.log(`Jailbreak detection => Trying to read path: ${path} using ${nativeFunc}`);
							this.jailbreakCall = true;
					}
				}
			},
			onLeave: function (retval) {
				if(this.jailbreakCall) {
					retval.replace(0xffffffff);
					console.log("Native Jailbreak detection bypassed!");
				}
			}
		});
	});
}


disableJB();