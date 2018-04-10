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
                for (canvas in canvases) {
                    terminal.output(canvas.title);
                }
            }
            else {
                terminal.output("There are currently no active canvases. Create one with 'touch'")
            }
        }
    });
}

export function touch(terminal, args) {

}

var commands = {
    "echo": echo,
    "ls": ls,
}

export default commands;