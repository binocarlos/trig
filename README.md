## trig

Compose command line applications from procfiles

## trigger files

you define your program with as a default set of triggers.

triggers are defined in a Procfile:

```yaml
info: echo "this is the info"
list: ./myscript.sh $@
backup: docker run --tm -it binocarlos/backup $@
```

Notice the `list` trigger references ./myscript.sh - this script should be placed in the same folder as the Procfile

## running triggers

If the path to our Procfile is `~/triggers/defaults` then the following command would print the command for the info step of our program:

```bash
$ trig ~/myprog/defaults run info
```

If we ran this command - it would output `this is the info` because the choosen trigger was executed.

Command line arguments are transferred into the trigger (as $@)

The following command runs the docker backup job poassing some arguments:

```bash
$ trig ~/myprog/defaults run backup --folder /tmp --source http://127.0.0.1:95858
```

## overrides

To allow the user customisation of the triggers - you can merge multiple Procfiles

The ordering of the Procfiles determines the priority for the overwrites.

For example - if we create an override file and save this in `~/myoverrides/defaults`:

```yaml
info: echo "apples is the info!"
```

If we ran trig against our defaults and overrides - the override would win:

```bash
$ trig ~/myprog/defaults ~/myprog/overrides run info
```

If we ran this command - it would print 

```bash
echo "apples is the info!"
```

## piping

A trigger itself can use a pipe within a single command:

```yaml
info: echo "this is the info" | upper-case
```

You can also use the `|` pipe symbol to concatenante commands in overidden Procfiles:

Changing our overrides file:

```yaml
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

```yaml
list: ./myscript.sh $@
```

This is the same as:

```yaml
list: myscript.sh $@
```

## docker

If you have docker installed then it can be used to run a trigger step.

Remember to use the --rm, -t and -i flags so the docker job removes itself after and plays nicely with streams:

```yaml
list: docker run --rm -t -i binocarlos/myjob $@
```

## command line variables

triggers have access to the command line passed to the original command via `$@`

```yaml
info: echo $@
```

Which would just print the command line options back again:

```bash
$ trig ~/myprog/defaults run info hello -a 10
```

would print `hello -a 10`

## multiple scripts

To have multiple triggers for a single command you can pipe them inside a single Procfile:

```yaml
info: proga | progb | progc | progd
```

Each step should play nice with stdin/stdout and stderr

## aliasing

It is useful to alias the name of your program to the trig command that runs your steps.

### non docker way

```bash
#!/bin/bash
$(trig /myapp/defaults /user/overrides run $@)
```

#### docker way

this means you don't need to install trig:

```bash
#!/bin/bash
$(docker run --rm -t -i -v /myapp:/myapp -v /user/overrides:/user/overrides binocarlos/trig /myapp/defaults.yaml /user/overrides/triggers.yaml run $@)
```

Create this script and then copy it to `/usr/local/bin/<yourscript>`

## notes

 * running a piped command in another folder [Stack Overflow](http://stackoverflow.com/questions/9394896/can-i-pipe-between-commands-and-run-the-programs-from-different-directories)

## license

MIT