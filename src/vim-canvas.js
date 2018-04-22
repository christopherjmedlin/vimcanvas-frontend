import CommandRunner from './runner';
import VimCanvasDisplay from './canvas';

class CommandInput extends CommandRunner {
    constructor(canvas, input, commands) {
        super(commands);
        this.canvas = canvas;
        this.input = input;

        $(this.input).keydown($.proxy(this.keyUp_, this));
    }

    focus() {
        this.input.value = ":";
        this.input.disabled = false;
        this.input.focus();
    }

    runCommand() {
        super.runCommand(this.input.value.slice(1));
        this.input.disabled = true;
        this.canvas.focus();
        this.canvas.draw();
    }

    output(text) {
        this.input.value = text;
    }

    keyUp_(event) {
        switch (event.which) {
            case 8:
                if (this.input.value == ":") {
                    this.input.value = "";
                    this.input.disabled = true;
                    this.canvas.focus();
                }
                break;
            case 13:
                this.runCommand();
                break;
        }
    }
}

export default class VimCanvas {

    constructor(canvasObject, containerID, terminal, commands={}) {
        this.canvasObject = canvasObject;
        this.container = document.getElementById(containerID);
        this.elements = {};
        this.terminal = terminal;
        this.commands = commands;
        
        $(window).resize($.proxy(this.resize_, this));
    }
    
    init() {     
        let wrapperDiv = document.createElement('div');
        wrapperDiv.className = "vimCanvas";
        this.container.appendChild(wrapperDiv);
        this.elements['wrapperDiv'] = wrapperDiv;

        let canvasElement = document.createElement('canvas');
        canvasElement.tabIndex = 1;
        wrapperDiv.appendChild(canvasElement);
        this.elements["canvas"] = canvasElement;

        this.secretInsertInput = document.createElement('input');
        this.secretInsertInput.hidden = true;
        wrapperDiv.appendChild(this.secretInsertInput);

        let input = document.createElement('input');
        input.className = "commandInput";
        input.disabled = true;
        wrapperDiv.appendChild(input);

        this.commandInput = new CommandInput(this, input, this.commands);
        this.canvas = new VimCanvasDisplay(canvasElement, this.commandInput, this.canvasObject);
        this.commandInput.display = this.canvas;

        this.canvas.focus();

        // horizontal scrollbar appears if i resize once so i do it twice.
        // ¯\_(ツ)_/¯
        this.resize_();
        this.resize_();

        this.draw();
    }

    tearDown() {
        this.container.removeChild(this.elements['wrapperDiv']);
    }

    focus() {
        this.canvas.focus();
    }

    draw() {
        this.canvas.draw();
    }

    resize_() {
        this.elements["canvas"].width = $(this.container).width();
        // subtract 25 to make up for the input
        this.elements["canvas"].height = $(this.container).height() - 25;
    }  
}