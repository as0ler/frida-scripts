import frida
import sys
import os
from optparse import OptionParser

def on_message(message, data):
    try:
        if message:
            print("[*] {0}".format(message["payload"]))
    except Exception as e:
        print(message)
        print(e)


if __name__ == '__main__':


    try:
        parser = OptionParser(usage="usage: %prog [options] <process_to_hook>",version="%prog 1.0")
        parser.add_option("-A", "--attach", action="store_true", default=False,help="Attach to a running process")
        parser.add_option("-S", "--spawn", action="store_true", default=False,help="Spawn a new process and attach")
        parser.add_option("-P", "--pid", action="store_true", default=False,help="Attach to a pid process")
        parser.add_option("-R", "--resume", action="store_true", default=False,help="Resume Process")
        parser.add_option("-f", "--function", action="store", dest="function", help="Name of the Function")
        parser.add_option("-a", "--address", action="store", dest="address", help="Address to attach")

        (options, args) = parser.parse_args()
        if (options.spawn):
            print ("[*] Spawning "+ str(args[0]))
            pid = frida.get_usb_device().spawn([args[0]])
            session = frida.get_usb_device().attach(pid)
        elif (options.attach):
            print ("[*] Attaching to process "+str(args[0]))
            session = frida.get_usb_device().attach(str(args[0]))
        elif (options.pid):
            print ("[*] Attaching to PID "+str(args[0]))
            session = frida.get_usb_device().attach(str(args[0]))
        elif (options.resume):
            session = frida.get_usb_device().resume()
            sys.exit(0)
        else:
            print ("Error")
            print ("[X] Option not selected. View --help option.")
            sys.exit(0)

        if (not (options.function and options.address)):
            print ("[X] Function or Address not defined")
            sys.exit(0)

        params = {"function":options.function,"address":options.address}

        print "[*] Hooking function => %(function)s at %(address)s" %params

        hook = """
                Interceptor.attach(ptr(%(address)s), {

                onEnter: function (args) {
                    send("%(function)s");
                },
                onLeave: function (retval) {
                    send ("Retval - Bool: " + retval);
                    retval.replace(0x01);
                    send ("Hooked and patched!");
                    send ("Retval - Bool: " + retval);
                }
                });
            """ % params

        script = session.create_script(hook)
        script.on('message', on_message)
        script.load()
        sys.stdin.read()
    except KeyboardInterrupt:
        sys.exit(0)
