import frida
import sys
import os 

def on_message(message, data):
    try:
        if message:
            print("[*] {0}".format(message["payload"]))
    except Exception as e:
        print(message)
        print(e)


if __name__ == '__main__':
    try:
	path = "hooks"
        session = frida.get_usb_device().attach(str(sys.argv[1]))
	for filename in os.listdir(path):
		name, ext = os.path.splitext(filename)
		if (ext == ".enabled"):
			print "[*] Parsing hook: "+filename
			hook = open(path+os.sep+filename, "r")
			script = session.create_script(hook.read())
			script.on('message', on_message)
			script.load()
        sys.stdin.read()
    except KeyboardInterrupt:
        sys.exit(0)
