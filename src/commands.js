import FakeTerminal from './terminal.js';
import VimCanvas from './canvas.js';
import $ from 'jquery';

export class CommandRunner {
    constructor(commands={}) {
        this.commands = commands;
    }

    runCommand(input) {
        input = input.split(" ");
        if (input[0] in this.commands)
            this.commands[input[0]](this, input.slice(1));
        else
            return "'" + input[0] + "' is not a command. Type 'help' for more information.";
    }
}

function getCanvases_(success) {
    $.ajax({
        url: "https://api.vimcanvas.christophermedlin.me/v1/canvases",
        dataType: 'JSON',
        success: success
    });
}

function getCanvas_(success, id) {
    let url = "https://api.vimcanvas.christophermedlin.me/v1/canvases/" + id;
    $.ajax({
        url: url,
        dataType: 'JSON',
        success: success
    })
}

export function echo(terminal, args) {
    if (args[0] != undefined)
        terminal.output(args[0]);
}

export function ls(terminal, args) {
    getCanvases_(canvases => {
        if (canvases.length) {
            for (var canvas in canvases) {
                terminal.output(canvases[canvas].name);
            }
        }
        else {
            terminal.output("There are currently no active canvases. Create one with 'touch'");
        }
    })
}

export function touch(terminal, args) {
    if (args.length)
        $.ajax({
            url: "https://api.vimcanvas.christophermedlin.me/v1/canvases",
            dataType: 'JSON',
            method: 'POST',
            data: JSON.stringify({
                "title": args[0]
            }),
            success: data => {
                console.log(data);
            }
        });
    else
        terminal.output("No name specified.");
}

export function vim(terminal, args) {
    getCanvases_(canvases => {
        for (var canvas in canvases) {
            if (canvases[canvas].name == args[0]) {
                getCanvas_(canvas => {
                    terminal.tearDown();
                    let vimCanvas = new VimCanvas(canvas, "mainDiv");
                    vimCanvas.init();
                }, canvases[canvas]._id);
            }
        }
    });
    if (!args.length)
        terminal.output("No name specified.");
}

var commands = {
    "echo": echo,
    "ls": ls,
    "touch": touch,
    "vim": vim
}

export default commands;