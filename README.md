## trig

Compose command line applications from procfiles

## trigger files

you define your program with as a default set of triggers.

triggers are defined in a Procfile:

```
info: echo "this is the info"
list: ./myscript.sh $@
backup: docker run --tm -it binocarlos/backup $@
```

Notice the `list` trigger references ./myscript.sh - this script should be placed in the same folder as the Procfile

## running triggers

If the path to our Procfile is `~/triggers/defaults` then the following command would print the command for the info step of our program:

```bash
$ trig ~/myprog/defaults plan info
```

If we ran the command that is printed - it would output `this is the info` because the choosen trigger was executed.

Command line arguments are transferred into the trigger (as $@)

The following command runs the docker backup job poassing some arguments:

```bash
$ trig ~/myprog/defaults plan backup --folder /tmp --source http://127.0.0.1:95858
```

## overrides

To allow the user customisation of the triggers - you can merge multiple Procfiles

The ordering of the Procfiles determines the priority for the overwrites.

For example - if we create an override file and save this in `~/myoverrides/defaults`:

```
info: echo "apples is the info!"
```

If we ran trig against our defaults and overrides - the override would win:

```bash
$ trig ~/myprog/defaults ~/myprog/overrides plan info
```

If we ran this command - it would print 

```bash
echo "apples is the info!"
```

## piping

A trigger itself can use a pipe within a single command:

```
info: echo "this is the info" | upper-case
```

You can also use the `|` pipe symbol to concatenante commands in overidden Procfiles:

Changing our overrides file:

```
info: | upper-case-first
```

If we ran the info step again - it would print:

```bash
echo "apples is the info!" | upper-case-first
```

Putting the `|` pipe symbol at the end means concatenante with the next command.

## trigger execution context

Triggers are 'eval'ed on the command line of the invoking shell and so have access to environment variables

Triggers are run with a `pwd` of the folder the Procfile file resides - this means triggers can execute scripts as their commands:

```
list: ./myscript.sh $@
```

This will be expanded to:

```
list: (cd /the/folder; myscript.sh $@)
```

Each step in a piped command will have the same transformation applied - this lets scripts from different folders be run in the same command:

~/default/triggers:
```
list: echo "hello"
```

~/custom/triggers:
```
list: | upper-case
```

If we combined ~/default/triggers with ~/custom/triggers we would get:

```
list: (cd ~/default/triggers; echo "hello") | (cd ~/custom/triggers; upper-case)
```

## docker

If you have docker installed then it can be used to run a trigger step.

Remember to use the --rm, -t and -i flags so the docker job removes itself after and plays nicely with streams:

```
list: docker run --rm -t -i binocarlos/myjob $@
```

## command line variables

triggers have access to the command line passed to the original command via `$@`

```
info: echo $@
```

Which would just print the command line options back again:

```bash
$ trig ~/myprog/defaults plan info hello -a 10
```

would print `hello -a 10`

## multiple scripts

To have multiple triggers for a single command you can pipe them inside a single Procfile:

```
info: proga | progb | progc | progd
```

Each step should play nice with stdin/stdout and stderr

## cli

You can use trig as a command line script or you can use it from within your node program.

cli:

```bash
usage: trig files... command stepname [options]

commands:

	plan - print the full command for a step 
  run - echo 'eval ' + the output of plan

```

## aliasing

It is useful to alias the name of your program to the trig command that runs your steps.

### non docker way

If you have done `npm install trig -g`:

```bash
#!/bin/bash
$(trig /myapp/defaults /user/overrides run $@)
```

#### docker way

If you have docker on your system:

```bash
#!/bin/bash
$(docker run --rm -t -i -v /myapp:/myapp -v /user/overrides:/user/overrides binocarlos/trig /myapp/defaults /user/overrides/triggers run $@)
```

#### running aliases

Create either of these scripts and then copy it to `/usr/local/bin/<yourscript>`

Once you have setup this alias you can run it as follows:

Imagine we named our alias script `myprog` and it resides in `/usr/local/bin`

```bash
$ myprog info apples
```

This would expand into running:

```
$ $(trig /myapp/defaults /user/overrides run info apples)
```

Which would eval the commands returned - modular cli!

## node api

You can generate trig commands from within your node.js program also:

#### `trig.plan(files, stepname, args)

Files is an array of Procfile paths.

Stepname is the command you want to generate.

Args is the remaining array of command line options (after the stepname).

```js
var trig = require('trig')

// get the raw command
var command = trig.plan(files, 'info', args)

// get the command prepended with eval
var command = trig.run(files, 'info', args)
```

## notes

 * running a piped command in another folder [Stack Overflow](http://stackoverflow.com/questions/9394896/can-i-pipe-between-commands-and-run-the-programs-from-different-directories)

## license

MIT