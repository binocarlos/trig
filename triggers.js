var parse = require('parse-procfile')
var merge = require('merge-concat')
var fs = require('fs')
var path = require('path')

function processTriggers(filepath, triggers){
	var folder = path.dirname(filepath)
	Object.keys(triggers || {}).forEach(function(key){

		var trigger = triggers[key]
		var startPipe = ''
		var endPipe = ''

		trigger = trigger.replace(/^\s*\|/, function(){
			startPipe = '| '
			return ''
		})

		trigger = trigger.replace(/\|\s*$/, function(){
			endPipe = ' |'
			return ''
		})

		trigger = trigger.replace(/\s*$/, '')

		triggers[key] = startPipe + '(cd ' + folder + '; ' + trigger + ')' + endPipe
	})
	return triggers
}

module.exports = function(files){

	var data = files.map(function(file){
		if(!fs.existsSync(file)){
			throw new Error(file + ' does not exist')
		}
		if(fs.statSync(file).isDirectory()){
			throw new Error(file + ' is a directory')	
		}
		var content = fs.readFileSync(file, 'utf8')
		return processTriggers(file, parse(content))
	})

	var flat = merge(data, function(prev, next, field){
		if(next.match(/^\|\s*/)){
			return prev + ' ' + next
		}
		else if(next.match(/\|\s*$/)){
			return next + ' ' + prev
		}
		else{
			return next
		}
	})

	return flat
}