import $ from 'jquery';

let WEBSOCKET_URL = "ws://api.vimcanvas.christophermedlin.me/v1/socket"

class CanvasCommandInput {
    constructor(canvas, containerID) {
        this.canvas = canvas;
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

    keyPress_(event) {
        switch (event.which) {
            case 8:
                if (this.input.value == ":") {
                    this.input.value = "";
                    this.input.disabled = true;
                    this.canvas.focus();
                }
        }
    }
}

export default class VimCanvas {

    constructor(canvasObject, containerID) {
        this.canvasObject = canvasObject;
        this.container = document.getElementById(containerID);
        this.elements = {};
        
        this.characterArray = [];
        for (let i = 0; i < 500; i++) {
            this.characterArray[i] = []
            for (let j = 0; j < 500; j++) {
                this.characterArray[i][j] = '#';
            }
        }
        $(window).resize($.proxy(this.resize_, this));
    }
    
    init() {     
        let wrapperDiv = document.createElement('div');
        wrapperDiv.className = "vimCanvas";
        this.container.appendChild(wrapperDiv);
        this.elements['wrapperDiv'] = wrapperDiv;

        let canvas = document.createElement('canvas');
        canvas.tabIndex = 1;
        wrapperDiv.appendChild(canvas);
        this.elements["canvas"] = canvas;

        this.commandInput = new CanvasCommandInput(this, "mainDiv");
        this.commandInput.init();

        canvas.focus();
        $(canvas).keydown($.proxy(this.keyPress_, this));

        // horizontal scrollbar appears if i resize once so i do it twice.
        // ¯\_(ツ)_/¯
        this.resize_();
        this.resize_();
    }

    initWebsocket() {
        this.socket = new WebSocket(WEBSOCKET_URL + "/" + this.canvasObject["_id"]);
    }

    tearDown() {
        this.container.removeChild(this.elements['wrapperDiv']);
        this.commandInput.tearDown();
    }

    focus() {
        this.elements["canvas"].focus();
    }

    resize_() {
        this.elements["canvas"].width = $(this.container).width();
        // subtract 25 to make up for the input
        this.elements["canvas"].height = $(this.container).height() - 25;
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