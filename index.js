var loadtriggers = require('./triggers')

module.exports = {
	run:function(files, trigger, args){
		var triggers = loadtriggers(files)
		var argsString = args.join(' ')

		var command = triggers[trigger]

		command = (command || '').replace(/\$\@/g, argsString)

		return command
	}
}