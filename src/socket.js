let WEBSOCKET_URL = "ws://api.vimcanvas.christophermedlin.me/v1/socket?id="

export default class WebsocketInterface {
    constructor(canvas) {
        this.canvas = canvas;
        this.socket = new WebSocket(WEBSOCKET_URL + this.canvas.canvasObject["_id"]);

        this.socket.onmessage = this.onmessage_.bind(this);
    }

    send(message) {
        this.socket.send(message);
    }

    onmessage_(e) {
        let event = JSON.parse(e.data).event;
        let data = event["data"];
        console.log(event);
        
        switch (event["type"]) {
            case "move":
               this.canvas.playerPositions[data["id"]] = [
                   data["x"], data["y"]
               ];
               break;
            case "char":
               this.canvas.changeChar(data["char"], data["x"], data["y"]);
               break;
        }

        this.canvas.draw();
    }
}