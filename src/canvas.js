import $ from 'jquery';
import CommandRunner from './runner';

let WEBSOCKET_URL = "ws://api.vimcanvas.christophermedlin.me/v1/socket"

class CanvasCommandInput extends CommandRunner {
    constructor(canvas, containerID, terminal, commands) {
        super(commands);
        this.canvas = canvas;
        this.terminal = terminal;
        this.container = document.getElementById(containerID);
    }

    init() {
        this.input = document.createElement('input');
        this.input.className = "commandInput";
        this.input.disabled = true;
        this.container.appendChild(this.input);
        $(this.input).keydown($.proxy(this.keyPress_, this));
    }

    focus() {
        this.input.value = ":";
        this.input.disabled = false;
        this.input.focus();
    }

    tearDown() {
        this.container.removeChild(this.input);
    }

    runCommand() {
        super.runCommand(this.input.value.slice(1));
        this.input.disabled = true;
        this.canvas.focus();
    }

    output(text) {
        this.input.value = text;
    }

    keyPress_(event) {
        switch (event.which) {
            case 8:
                if (this.input.value == ":") {
                    this.input.value = "";
                    this.input.disabled = true;
                    this.canvas.focus();
                }
            case 13:
                this.runCommand();
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

        this.translateX = 0;
        this.translateY = 0;
        this.scale = 1;
        
        this.characterArray = [];
        for (let i = 0; i < 500; i++) {
            this.characterArray[i] = []
            for (let j = 0; j < 500; j++) {
                this.characterArray[i][j] = '##00FF00';
            }
        }
        $(window).resize($.proxy(this.resize_, this));
    }
    
    init() {     
        let wrapperDiv = document.createElement('div');
        wrapperDiv.className = "vimCanvas";
        this.container.appendChild(wrapperDiv);
        this.elements['wrapperDiv'] = wrapperDiv;

        this.canvas = document.createElement('canvas');
        this.canvas.tabIndex = 1;
        wrapperDiv.appendChild(this.canvas);

        this.commandInput = new CanvasCommandInput(this, "mainDiv", this.terminal, this.commands);
        this.commandInput.init();

        this.canvas.focus();
        $(this.canvas).keydown($.proxy(this.keyPress_, this));

        // horizontal scrollbar appears if i resize once so i do it twice.
        // ¯\_(ツ)_/¯
        this.resize_();
        this.resize_();

        this.draw();
    }

    initWebsocket() {
        this.socket = new WebSocket(WEBSOCKET_URL + "/" + this.canvasObject["_id"]);
    }

    tearDown() {
        this.container.removeChild(this.elements['wrapperDiv']);
        this.commandInput.tearDown();
    }

    focus() {
        this.canvas.focus();
    }

    draw() {
        let ctx = this.canvas.getContext("2d");
        ctx.font = "15px monospace";
        ctx.fillStyle = "#00FF00";

        ctx.scale(this.scale, this.scale);
        ctx.translate(this.translateX, this.translateY);
        
        for (var line in this.characterArray) {
            for (var character in this.characterArray[line]) {
                ctx.fillStyle = this.characterArray[line][character].slice(1);
                ctx.fillText(
                    this.characterArray[line][character][0],
                    character * 15,
                    (line * 15) + 15
                );
            }
        }
        
        //ctx.fillText("#", 1, 15);
    }

    resize_() {
        this.canvas.width = $(this.container).width();
        // subtract 25 to make up for the input
        this.canvas.height = $(this.container).height() - 25;
    }

    keyPress_(event) {
        if (event.which == 186 && event.shiftKey) {
            event.preventDefault();
            this.commandInput.focus();
        }
    }

    onWebsocketMessage_(event) {
        canvasEvent = JSON.parse(event.data).event;

        switch (canvasEvent.type) {
            
        }
    }
}