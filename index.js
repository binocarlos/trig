var loadtriggers = require('./triggers')

function getCommand(files, trigger, args){
	var triggers = loadtriggers(files)
	var argsString = (args || []).join(' ')

	var command = triggers[trigger]

	command = (command || '').replace(/\$\@/g, argsString)

	return command
}

module.exports = {
	plan:function(files, trigger, args){
		return getCommand(files, trigger, args)
	},
	run:function(files, trigger, args){
		return 'eval ' + getCommand(files, trigger, args)
	}
}