var tape = require('tape')
var cp = require('child_process')
var path = require('path')
var triggers = require('./triggers')

function runTrig(t, command, done){
	command = 'node cli.js ' + command
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
	var defaultTriggers = 'test/defaults'
	var overrideTriggers = 'test/overrides'

	var command = [defaultTriggers, overrideTriggers, 'plan', 'info']
	runTrig(t, command.join(' '), function(err, command){
		if(err){
			t.fail(err, 'load command')
			t.end()
			return
		}
		command = command.replace(/\n$/, '')
		t.equal(command, '(cd /srv/projects/trig/test; echo "this is the info") | (cd /srv/projects/trig/test;  ./upper-case)', 'command is generated')
		t.end()
	})
})


tape('remove double pipes', function(t){
	var defaultTriggers = 'test/defaults'
	var overrideTriggers = 'test/overrides'

	var command = [defaultTriggers, overrideTriggers, 'plan', 'doublepipe']
	runTrig(t, command.join(' '), function(err, command){
		if(err){
			t.fail(err, 'load command')
			t.end()
			return
		}
		command = command.replace(/\n$/, '')
		t.equal(command, '(cd /srv/projects/trig/test; echo "hello") | (cd /srv/projects/trig/test;  ./upper-case)', 'command is generated')
		t.end()
	})
})


tape('run a command via the alias', function(t){

	cp.exec('./alias.sh info', function(err, stdout, stderr){
		if(err || stderr){
			t.fail(err || stderr.toString(), 'run alias')
			t.end()
			return
		}
		var result = stdout.toString().replace(/\n$/, '')
		t.equal(result, 'THIS IS THE INFO', 'output of alias')
		t.end()
	})
	
})


tape('pipe via the alias', function(t){

	cp.exec('echo "hello world" | ./alias.sh piped', function(err, stdout, stderr){
		if(err || stderr){
			t.fail(err || stderr.toString(), 'run piped alias')
			t.end()
			return
		}
		var result = stdout.toString().replace(/\n$/, '')
		t.equal(result, 'HELLO WORLD', 'output of piped alias')
		t.end()
	})
	
})