import $ from 'jquery';

let WEBSOCKET_URL = "wss://api.vimcanvas.christophermedlin.me/v1/socket"

export default class VimCanvas {

    constructor(canvasObject, containerID) {
        this.canvasObject = canvasObject;
        this.container = document.getElementById(containerID)
        this.elements = {};
        $(window).resize($.proxy(this.resize_))
    }
    
    init() {     
        let wrapperDiv = document.createElement('div');
        wrapperDiv.className = "vimCanvas";
        this.container.appendChild(wrapperDiv);
        this.elements['wrapperDiv'] = wrapperDiv;

        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);

        let commandInput = document.createElement('input');
        this.container.appendChild(commandInput);
        this.elements['commandInput'] = commandInput;
    }

    initWebsocket() {
        this.socket = new WebSocket(WEBSOCKET_URL);
    }

    resize_() {

    }

    onWebsocketMessage_(event) {
        canvasEvent = JSON.parse(event.data).event;

        switch (canvasEvent.type) {
            
        }
    }
}