var args = process.argv.splice(2)
var resolve = require('cli-path-resolve')

var triggerFiles = []

function commandRun(trigger, args){

}

var commands = {
	run:commandRun
}

var found = null
args.forEach(function(arg){
	if(found){
		return
	}
	if(commands[arg]){
		found = arg
		return
	}
	triggerFiles.push(arg)
})

if(!found){
	console.error('no command found')
	process.exit(1)
}

if(triggerFiles.length<=0){
	console.error('no trigger files specified')
	process.exit(1)	
}

args = args.splice(triggerFiles.length)

console.log('-------------------------------------------');
console.log('trigger')
console.dir(triggerFiles)
console.log('-------------------------------------------');
console.log('args')
console.dir(args)