## trig

a library for composing command line applications from smaller, docker based commands

This is useful if you want to override the default behaviour of a PaaS or generally control and override the behaviour of a cli application.

## trigger files

you define your program with a default set of actions, these actions, like user overrides are defined in a yaml file like so:

```yaml
info: echo "this is the info"
list: ./myscript.sh $@
backup: docker run --tm -it binocarlos/backup $@
```

save this file as `~/myprog/defaults.yaml`

It references ./myscript.sh - this should be placed in the same folder as the defaults.yaml

## running triggers

The following command would run the info step of our program:

```bash
$ trig ~/myprog/defaults.yaml run info
```

If we ran this command - it would output `this is the info`

You can pass arguments to the trigger - these are injected into the $@ variables in .yaml file

The following command runs the docker backup job poassing some arguments:

```bash
$ trig ~/myprog/defaults.yaml run backup --folder /tmp --source http://127.0.0.1:95858
```

## overrides

To allow the user customisation of the triggers - you can run multiple .yaml files against a trigger.

The ordering of the .yaml files defines what command is actually run - the later in the order the more priority.

For example - if we create an override file:

```yaml
info: echo "apples is the info!"
```

And save this in `~/myoverrides/defaults.yaml`

Then we can run the info trigger against the 2 yamls:

```bash
$ trig ~/myprog/defaults.yaml ~/myoverrides/defaults.yaml run info
```

If we ran this command - it would output `apples is the info!`

## piping

A trigger itself can use a pipe in a single command (upper-case-first is a script that converts input to camel case and prints it):

```yaml
info: echo "this is the info" | upper-case-first
```

Where it gets interesting is to put a pipe symbol at either end of a trigger command - this appends/prepends the next/last command.

Changing our overrides file:

```yaml
info: | upper-case-first
```

If we then ran the info trigger against both files again:

```bash
$ trig ~/myprog/defaults.yaml ~/myoverrides/triggers.yaml run info
```

If we ran this command - we would get `This Is The Info` - that is the original output but piped through the override.

## trigger execution context

Triggers are 'eval'ed on the command line of the invoking program and so have access to environment variables

Triggers are run with a `pwd` of the folder the .yaml file resides - this means triggers can execute scripts from within the same folder

## command line variables

triggers can also access the command line arguments of the invoking command by using the $@ symbol:

```yaml
info: echo $@
```

Just print the command line options back again:

```bash
$ trig ~/myprog/defaults.yaml run info hello
```

would print `hello`

## multiple scripts

If you want multiple scripts to run for a single trigger then you can either write a script that run the multiple parts or put the extra scripts in the pipe

## aliasing

It is simple to alias trig to the name of your program pre-configured with defaults and overrides.

The non-docker way:

```bash
#!/bin/bash
$(trig /myapp/defaults.yaml /user/overrides/triggers.yaml run $@)
```

The docker way:

```bash
#!/bin/bash
$(docker run --rm -t -i -v /myapp:/myapp -v /user/overrides:/user/overrides binocarlos/trig /myapp/defaults.yaml /user/overrides/triggers.yaml run $@)
```

## notes

 * running a piped command in another folder [Stack Overflow](http://stackoverflow.com/questions/9394896/can-i-pipe-between-commands-and-run-the-programs-from-different-directories)

## license

MIT