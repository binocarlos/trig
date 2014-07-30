var loadtriggers = require('./triggers')

module.exports = {
	run:function(files, trigger, args){
		var triggers = loadtriggers(files)

		console.log('-------------------------------------------');
		console.dir(triggers)
		return''
	}
}