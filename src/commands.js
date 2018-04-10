import FakeTerminal from './terminal.js';
import $ from 'jquery';

export function echo(terminal, args) {
    if (args[0] != undefined)
        terminal.output(args[0]);
}

export function ls(terminal, args) {
    $.ajax({
        url: "https://api.vimcanvas.christophermedlin.me/v1/canvases",
        dataType: 'JSON',
        success: function(canvases) {
            if (canvases.length) {
                for (var canvas in canvases) {
                    terminal.output(canvases[canvas].name);
                }
            }
            else {
                terminal.output("There are currently no active canvases. Create one with 'touch'");
            }
        }
    });
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
            success: function(data) {
                console.log(data);
            }
        });
    else
        terminal.output("No name specified.");
}

var commands = {
    "echo": echo,
    "ls": ls,
    "touch": touch
}

export default commands;