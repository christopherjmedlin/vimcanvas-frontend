export default class CommandRunner {
    constructor(commands={}) {
        this.commands = commands;
    }

    runCommand(input) {
        input = input.split(" ");
        if (input[0] in this.commands)
            this.commands[input[0]](this, input.slice(1));
        else
            this.output("'" + input[0] + "' is not a command. Type 'help' for more information.");
    }
}