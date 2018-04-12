import $ from 'jquery';

let WEBSOCKET_URL = "wss://api.vimcanvas.christophermedlin.me/v1/socket"

class CanvasCommandInput {
    constructor(canvas, containerID) {
        this.canvas = canvas;
        this.container = document.getElementById(continerID);
        $(window).resize($.proxy(this.resize_));
    }

    init() {
        this.input = document.createElement('input');
        this.input.className = "commandInput";
        this.container.appendChild(this.input);
    }

    resize_() {
        $(this.input).width($(this.container).width());
    }
}

export default class VimCanvas {

    constructor(canvasObject, containerID) {
        this.canvasObject = canvasObject;
        this.container = document.getElementById(containerID);
        this.elements = {};
        $(window).resize($.proxy(this.resize_, this));
    }
    
    init() {     
        let wrapperDiv = document.createElement('div');
        wrapperDiv.className = "vimCanvas";
        this.container.appendChild(wrapperDiv);
        this.elements['wrapperDiv'] = wrapperDiv;

        this.canvas = document.createElement('canvas');
        this.canvas.tabIndex = 1;
        this.container.appendChild(this.canvas);

        let commandInput = document.createElement('input');
        commandInput.className = "commandInput";
        this.container.appendChild(commandInput);
        this.elements['commandInput'] = commandInput;

        this.canvas.focus();
        $(this.canvas).keydown($.proxy(this.keyPress_, this));

        // horizontal scrollbar appears if i resize once so i do it twice.
        // ¯\_(ツ)_/¯
        this.resize_();
        this.resize_();
    }

    initWebsocket() {
        this.socket = new WebSocket(WEBSOCKET_URL);
    }

    tearDown() {
        this.container.removeChild(this.elements['wrapperDiv']);
    }

    resize_() {
        this.canvas.width = $(this.container).width();
        // subtract 6 to make up for borders, maybe make this more dynamic later
        this.canvas.height = $(this.container).height() - $(this.elements['commandInput']).height() - 8;
        $(this.elements['commandInput']).width($(this.container).width());
    }

    keyPress_(event) {
        if (event.which == 186 && event.shiftKey) {
            this.elements['commandInput'].focus();
        }
    }

    onWebsocketMessage_(event) {
        canvasEvent = JSON.parse(event.data).event;

        switch (canvasEvent.type) {
            
        }
    }
}