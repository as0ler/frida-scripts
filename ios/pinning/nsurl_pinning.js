'use strict';

async function disablePinning (args) {
	const NSURLCredential = ObjC.classes.NSURLCredential;
  const resolver = new ApiResolver("objc");
  resolver.enumerateMatches( "-[* URLSession:didReceiveChallenge:completionHandler:]", {
    onMatch: function (i) {
      console.log('Found NSURLSession based classes.');

      Interceptor.attach(i.address, {
          onEnter(args) {
            const receiver = new ObjC.Object(args[0]);
            const selector = ObjC.selectorAsString(args[1]);
  
            console.log(`-[${receiver} ${selector}] Hooked`);
            const challenge = new ObjC.Object(args[3]);

            const completionHandler = new ObjC.Block(args[4]);
            const savedCompletionHandler = completionHandler.implementation;
            const NSURLSessionAuthChallengeUseCredential = 0

            completionHandler.implementation = function() { 
              console.log("Modified completionHandler called.");
              const credential = NSURLCredential.credentialForTrust_(challenge.protectionSpace().serverTrust());
              challenge.sender().useCredential_forAuthenticationChallenge_(credential, challenge);
              
              savedCompletionHandler(NSURLSessionAuthChallengeUseCredential, credential);
            };
          }});
    },
    onComplete: function () {
    }
  });
}

disablePinning();
