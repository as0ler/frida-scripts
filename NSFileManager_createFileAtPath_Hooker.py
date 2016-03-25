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

    if(ObjC.available) {

        for(var className in ObjC.classes) {
            if (ObjC.classes.hasOwnProperty(className)) {
                if(className == "NSFileManager") {
                    send("Found our target class : " + className);
                }
            }
        }

        var hook = ObjC.classes.NSFileManager["- createFileAtPath:contents:attributes:"];
        Interceptor.attach(hook.implementation, {
            onEnter: function(args) {

                var receiver = new ObjC.Object(args[0]);
                send("Target class : " + receiver);

                var sel = ObjC.selectorAsString(args[1]);
                send("Hooked the target method : " + sel);

                var obj = ObjC.Object(args[2]);
                send("[+] File : " + obj.toString());
                
		var obj = ObjC.Object(args[3]);
                send("[+] Content : " + obj.toString());
                
		var obj = ObjC.Object(args[4]);
                send("[+] Attributes : " + obj.toString());
            }
        });
    } else {
        console.log("Objective-C Runtime is not available!");
    }


    """

    return hook

if __name__ == '__main__':
    try:
        session = frida.get_usb_device().attach("testingDataProtectionclasses")
        script = session.create_script(do_hook())
        script.on('message', on_message)
        script.load()
        sys.stdin.read()
    except KeyboardInterrupt:
        sys.exit(0)
