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

		triggers[key] = startPipe + '(cd ' + folder + '; ' + trigger + ')' + endPipe
	})
	return triggers
}

module.exports = function(files){

	var data = files.map(function(file){
		if(!fs.existsSync(file)){
			throw new Error(file + ' does not exist')
		}
		var content = fs.readFileSync(file, 'utf8')
		return processTriggers(file, parse(content))
	})

	var flat = merge(data, function(prev, next, field){
		if(prev.match(/\|\s*$/) || next.match(/^\s*\|/)){
			return prev + ' ' + next
		}
		else{
			return next
		}
	})

	return flat
}