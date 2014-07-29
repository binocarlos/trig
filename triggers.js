var loadTrigger = require('./loadtrigger')
module.exports = function(files){

	console.log('-------------------------------------------');
	console.dir(files)
	var data = files.map(loadTrigger)
	console.log('-------------------------------------------');
	console.dir(data)
	return {}
}