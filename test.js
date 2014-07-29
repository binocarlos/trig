var tape = require('tape')
var cp = require('child_process')
var path = require('path')
var loadtrigger = require('./loadtrigger')

tape('load a config yaml', function(t){
	var triggers = loadtrigger(path.join(__dirname, 'test', 'default.yaml'))
	t.equal(triggers.info, 'echo "this is the info"', 'info equal')
	t.equal(triggers.list, './myscript.sh $@', 'list equal')
	t.end()
})

tape('load a json yaml', function(t){
	var triggers = loadtrigger(path.join(__dirname, 'test', 'default.json'))
	t.equal(triggers.info, 'echo "this is the info"', 'info equal')
	t.equal(triggers.list, './myscript.sh $@', 'list equal')
	t.end()
})

function runTrig(t, command, done){
	command = 'node index.js ' + command
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
	var defaultTriggers = 'test/default.yaml'
	var overrideTriggers = 'test/overrides.yaml'

	var command = [defaultTriggers, overrideTriggers, 'run', 'info']
	runTrig(t, command.join(' '), function(err, command){
		console.log('-------------------------------------------');
		console.log(command)
		t.end()
	})
})