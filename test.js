var tape = require('tape')
var cp = require('child_process')

function runTrig(t, command, done){
	command = 'node ' + path.join(__dirname, 'index.js') + ' ' + command
	cp.exec(command, function(err, stdout, stderr){
		if(err || stderr){
			t.fail(err || stderr.toString(), 'run command')
			t.end()
			return
		}
		done(null, stdout.toString())
	})
}

tape('get a command from an overriden pipe', function(t){
	
})