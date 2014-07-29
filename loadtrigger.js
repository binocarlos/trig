var yaml = require('js-yaml')
var fs = require('fs')

var parsers = {
	json:function(content){
		var doc
		try {
			doc = JSON.parse(content)
		} catch (e) {
		}
		return doc
	},
	yaml:function(content){
		var doc = {}
		try {
		  doc = yaml.safeLoad(content)
		} catch (e) {
		}
		return doc
	}
}

module.exports = function(path){
	if(!fs.existsSync(path)){
		return {}
	}
	var content = fs.readFileSync(path, 'utf8')
	var parser
	if(path.match(/\.json/i)){
		parser = parsers.json
	}
	else if(path.match(/\.y\a?ml/i)){
		parser = parsers.yaml
	}
	if(parser){
		return parser(content)
	}
	else{
		return {}
	}
}