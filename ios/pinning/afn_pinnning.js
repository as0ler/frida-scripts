'use strict';

async function disablePinning (args) {
	disableValidatesDomainName();
	setAllowInvalidCertificates();
    pinnedCertificatesToNull();
	setPolicyWithPinningModeToNone();
	setSSLPinningModeNull();
	
	// One-Shot Hook
	//disableEvaluateServerTrust();
}

function disableEvaluateServerTrust () {
	var resolver = new ApiResolver('objc');
	var matches = resolver.enumerateMatchesSync("-[AFSecurityPolicy evaluateServerTrust:forDomain:]");
	if (matches.lenght == 0) {
		return;
	}
	Interceptor.attach(
		ptr(matches[0]["address"]),
		{
			onLeave: function(retval) {
				console.log("[*] -[AFSecurityPolicy evaluateServerTrust:forDomain:] hits!");
				retval.replace(ptr(0x01));
			}
		}
	);
}

function pinnedCertificatesToNull () {
	var AFSecurityPolicy = ObjC.classes["AFSecurityPolicy"];
	Interceptor.attach(
		AFSecurityPolicy["- setPinnedCertificates:"].implementation, {
			onEnter(args) {
				if (!args[2].isNull()) {
					console.log("Replacing AFSecurityPolicy setPinnedCertificates: = nil ");
					args[2] = new NativePointer(0x0); //AFSSLPinningModeNone
				}
			}
		}
	);
}

 // -[AFSecurityPolicy setValidatesDomainName:]
function disableValidatesDomainName (){
	var AFSecurityPolicy = ObjC.classes["AFSecurityPolicy"];
	Interceptor.attach(
		AFSecurityPolicy["- setValidatesDomainName:"].implementation, {
			onEnter(args) {
				if (!args[2].isNull()) {
					console.log("Replacing AFSecurityPolicy - setValidatesDomainName: = NO ");
					args[2] = new NativePointer(0x0);
				}
			}
		}
	);
}

 // -[AFSecurityPolicy setSSLPinningMode:]
function setSSLPinningModeNull () {
	var AFSecurityPolicy = ObjC.classes["AFSecurityPolicy"];
	Interceptor.attach(
		AFSecurityPolicy["- setSSLPinningMode:"].implementation, {
			onEnter(args) {
				if (!args[2].isNull()) {
					console.log("Replacing AFSecurityPolicy setSSLPinningMode = AFSSLPinningModeNone ");
					args[2] = new NativePointer(0x0); //AFSSLPinningModeNone
				}
			}
		}
	);
}

// -[AFSecurityPolicy setAllowInvalidCertificates:]
function setAllowInvalidCertificates () {
	var AFSecurityPolicy = ObjC.classes["AFSecurityPolicy"];
	Interceptor.attach(
		AFSecurityPolicy["- setAllowInvalidCertificates:"].implementation, {
			onEnter(args) {
				// setAllowInvalidCertificates == NO
				if (args[2].equals(new NativePointer(0x0))) {
					console.log("Replacing AFSecurityPolicy setAllowInvalidCertificates = YES ");
					args[2] = new NativePointer(0x1);
				}
			}
		}
	);
}

// +[AFSecurityPolicy policyWithPinningMode:]
// +[AFSecurityPolicy policyWithPinningMode:withPinnedCertificates:]
function setPolicyWithPinningModeToNone () {
	var AFSecurityPolicy = ObjC.classes["AFSecurityPolicy"];
	Interceptor.attach(
		AFSecurityPolicy["+ policyWithPinningMode:"].implementation, {
			onEnter(args) {
				if (!args[2].isNull()) {
					console.log("Replacing AFSecurityPolicy policyWithPinningMode = AFSSLPinningModeNone ");
					args[2] = new NativePointer(0x0);
				}
			}
		}
	);
	if (AFSecurityPolicy["+ policyWithPinningMode:withPinnedCertificates:"]) {
		Interceptor.attach(
			AFSecurityPolicy["+ policyWithPinningMode:withPinnedCertificates:"].implementation, {
				onEnter(args) {
					if (!args[2].isNull()) {
						console.log("Replacing AFSecurityPolicy policyWithPinningMode:withPinnedCertificates: = AFSSLPinningModeNone ");
						args[2] = new NativePointer(0x0);
					}
				}
			}
		);
	}
}

disablePinning();