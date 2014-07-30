var tape = require('tape')
var cp = require('child_process')
var path = require('path')
var triggers = require('./triggers')

function runTrig(t, command, done){
	command = 'node cli.js ' + command
	console.log('running')
	console.log(command)
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

	var command = [defaultTriggers, overrideTriggers, 'run', 'info']
	runTrig(t, command.join(' '), function(err, command){
		console.log('-------------------------------------------');
		console.log(command)
		t.end()
	})
})