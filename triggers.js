var parse = require('parse-procfile')
var merge = require('merge-concat')
var fs = require('fs')

module.exports = function(files){

	var data = files.map(function(file){
		if(!fs.existsSync(file)){
			throw new Error(file + ' does not exist')
		}
		var content = fs.readFileSync(file, 'utf8')
		return parse(content)
	})

	var flat = merge(data, function(prev, next, field){
		console.log('-------------------------------------------');
		console.log('-------------------------------------------');
		console.dir(prev)
		console.dir(next)
		if(prev.match(/\|\s*$/) || next.match(/^\s*\|/)){
			return prev + ' ' + next
		}
		else{
			return next
		}
	})

	return flat
}