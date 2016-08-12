var libraries = Process.enumerateModulesSync();
for(var i in libraries) {
	if (libraries[i].name == 'libsqlite3.dylib' ) {
		send("Using library : " + libraries[i].name);
		var functions = Module.enumerateExportsSync("libsqlite3.dylib");
		for (var j in functions) {
			if (functions[j].name == 'sqlite3_open' 
			|| functions[j].name == 'sqlite3_open16' 
			|| functions[j].name == 'sqlite3_open_v2') {
				send("Found target method : " + functions[j].name);
				Interceptor.attach(functions[j].address, {
					OnEnter: function(args) { 
						send("[+][libsqlite3.dylib] Database open at: " + args[0].toString());
					}
				});
			}
			if (functions[j].name == 'sqlite3_prepare' 
			|| functions[j].name == 'sqlite3_prepare_v2' 
			|| functions[j].name == 'sqlite3_prepare16_v2' 
			|| functions[j].name == 'sqlite3_prepare16') {
				send("Found target method : " + functions[j].name);
				Interceptor.attach(functions[j].address, {
					OnEnter: function(args) { 
						send("[+][libsqlite3.dylib] Database SQL At: " + args[0].toString());
						send("\t - SQL: " + args[1].toString());
					}
				});
			}
		}
	}
}
