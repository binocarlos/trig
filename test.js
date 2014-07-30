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