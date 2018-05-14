import $ from 'jquery';
import WebsocketInterface from './socket';

export default class VimCanvasDisplay {

    constructor(canvas, commandInput, canvasObject, insertInput) {
        this.canvas = canvas;
        this.commandInput = commandInput;
        this.canvasObject = canvasObject;
        this.insertInput = insertInput

        this.playerPos = [Math.floor(Math.random() * 101),
            Math.floor(Math.random() * 101)];
        this.playerPositions = {};
        this.mode = "normal";
        this.translateX = -this.playerPos[0] + 5;
        this.translateY = -this.playerPos[1] + 5;
        this.scale = 1;

        this.highlightPos = this.playerPos.slice();

        this.socket = new WebsocketInterface(this);

        let alteredChars = this.canvasObject["alteredChars"];
        this.characterArray = [];
        for (let i = 0; i < 100; i++) {
            this.characterArray[i] = []
            for (let j = 0; j < 100; j++) {
                let alteredChar = false;
                for (var char in alteredChars) {
                    let x = alteredChars[char]["coords"][0];
                    let y = alteredChars[char]["coords"][1];
                    
                    if (x == j && y == i) {
                        this.characterArray[i][j] = alteredChars[char]["char"] + 
                                                    alteredChars[char]["color"];
                        alteredChar = true;
                    }
                }
                if (!alteredChar)    
                    this.characterArray[i][j] = '_#00FF00';
            }
        }

        $(window).resize($.proxy(this.draw, this));
        $(this.canvas).keyup($.proxy(this.keyUp_, this));
        $(this.canvas).keypress($.proxy(this.keyPress_, this));
        $(this.insertInput).keyup($.proxy(this.keyUpInsertMode_, this));
    }

    focus() {
        this.canvas.focus();
    }

    changeChar(char, x, y, width=1, height=1) {
        for (let i = y; i < y + height; i++) {
            for (let j = x; j < x + width; j++) {
                this.characterArray[i][j] = char + this.characterArray[i][j].slice(1);
            }
        }
    }

    changeColor(color, x, y, width=1, height=1) {
        for (let i = y; i < y + height; i++) {
            for (let j = x; j < x + width; j++) {
                this.characterArray[i][j] = this.characterArray[i][j][0] + color;
            }
        } 
    }

    draw() {
        let ctx = this.canvas.getContext("2d");
        ctx.save()
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.font = "15px monospace";
        ctx.fillStyle = "#00FF00";

        ctx.translate(this.canvas.width/2, this.canvas.height/2)

        ctx.scale(this.scale, this.scale);
        ctx.translate(this.translateX * 15, this.translateY * 17);

        ctx.beginPath();
        for (var line in this.characterArray) {
            for (var character in this.characterArray[line]) {
                this.drawChar_(ctx, line, character);
            }
        }
        
        this.drawPlayers_(ctx);
        ctx.restore();
    }

    drawPlayers_(ctx) {
        ctx.strokeStyle = "#00FF00";
        for (var coord in this.playerPositions) {         
            this.drawPlayer_(ctx, this.playerPositions[coord]);
        }

        if (this.mode == "insert") {
            ctx.strokeStyle = "#0000FF";
        }
        else if (this.mode == "normal") {
            ctx.strokeStyle = "#FF0000";
        }
        else {
            ctx.strokeStyle = "#551a8b";
        }

        if (this.mode != "visual") {
            this.drawPlayer_(ctx, this.playerPos);
        }
        else {
            // top left corner is based on which of the two points is furthest up and
            // furthest to the left
            let x = Math.min(this.playerPos[0], this.highlightPos[0]) * 15 - 3;
            let y = Math.min(this.playerPos[1], this.highlightPos[1]) * 17 + 2;

            // width and height are the abs. value of the difference between the points
            let width = (Math.abs(this.playerPos[0] - this.highlightPos[0]) + 1) * 15;
            let height = (Math.abs(this.playerPos[1] - this.highlightPos[1]) + 1) * 17;

            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.stroke();
        }
    }

    drawPlayer_(ctx, player) {
        // draw a rectangle to highlight cursor
        let x = player[0] * 15 - 2;
        let y = player[1] * 17 + 2;
        ctx.beginPath();
        ctx.rect(x, y, 13, 15);
        ctx.stroke();
    }

    drawChar_(ctx, line, character) {
        ctx.fillStyle = this.characterArray[line][character].slice(1);
        ctx.fillText(
            this.characterArray[line][character][0],
            character * 15,
            (line * 17) + 15
        );     
    }

    keyPress_(event) {
        if (event.which == 58 && // : 
            event.shiftKey && 
            (this.mode == "normal" || this.mode == "visual")) {
            event.preventDefault();
            this.commandInput.focus();
        }
    }

    keyUp_(event) {
        switch (event.which) {
            case 37: // left arrow
                this.translateX += 4;
                break;
            case 38: // up arrow
                this.translateY += 4;
                break;
            case 39: // right arrow
                this.translateX -= 4;
                break;
            case 40: // down arrow
                this.translateY -= 4;
                break;
        }

        if (this.mode == "normal") {
            this.keyUpNormalMode_(event);
        }
        else if (this.mode == "insert") {
            this.keyUpInsertMode_(event);
        }
        else if (this.mode == "visual") {
            this.keyUpVisualMode_(event);
        }

        this.draw();
    }

    keyUpNormalMode_(event) {
        switch (event.which) {
            case 72: // h
                this.playerPos[0] -= 1;
                break;
            case 74: // j
                this.playerPos[1] += 1;
                break;
            case 75: // k
                this.playerPos[1] -= 1;
                break;
            case 76: // l
                this.playerPos[0] += 1;
                break;
            case 73: // i
            case 65: // a
                this.insertInput.focus();
                if (this.mode == "normal") {
                    this.mode = "insert";
                }
                break;
            case 86: // v
                this.mode = "visual";
                break;
            case 189: // dash
                this.scale /= 2;
                break;
            case 187: // plus
                this.scale *= 2;
                break;
        }

        if (event.which >= 72 && event.which <= 76) {
            this.socket.send("move " + this.playerPos[0] + " " + this.playerPos[1])
            this.highlightPos = this.playerPos.slice();
        }
    }

    keyUpInsertMode_(event) {
        switch (event.which) {
            case 27: // escape
                this.canvas.focus();
                if (this.mode == "insert") {
                    this.mode = "normal";
                }
                this.draw();
                break;
        }

        if (this.insertInput.value != "") {
            this.socket.send("char " + this.playerPos[0] + " " + this.playerPos[1] + " " +
                            this.insertInput.value[0])
            this.mode = "normal";
            this.canvas.focus();
            this.insertInput.value = "";
        }
    }

    keyUpVisualMode_(event) {
        switch (event.which) {
            case 72: // h
                this.highlightPos[0] -= 1;
                break;
            case 74: // j
                this.highlightPos[1] += 1;
                break;
            case 75: // k
                this.highlightPos[1] -= 1;
                break;
            case 76: // l
                this.highlightPos[0] += 1;
                break;
            case 27:
                this.mode = "normal";
                break;
        }
    }
}