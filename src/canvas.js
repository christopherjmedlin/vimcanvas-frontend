import $ from 'jquery';
import WebsocketInterface from './socket';

export default class VimCanvasDisplay {

    constructor(canvas, commandInput, canvasObject) {
        this.canvas = canvas;
        this.commandInput = commandInput;
        this.canvasObject = canvasObject;

        this.playerPos = [Math.floor(Math.random() * 101),
            Math.floor(Math.random() * 101)];
        this.playerPositions = {};
        this.mode = "normal";
        this.translateX = -this.playerPos[0] + 5;
        this.translateY = -this.playerPos[1] + 5;
        this.scale = 1;

        this.socket = new WebsocketInterface(this);

        this.characterArray = [];
        for (let i = 0; i < 100; i++) {
            this.characterArray[i] = []
            for (let j = 0; j < 100; j++) {
                this.characterArray[i][j] = '##00FF00';
            }
        }

        $(window).resize($.proxy(this.draw, this));
        $(this.canvas).keyup($.proxy(this.keyUp_, this));
        $(this.canvas).keypress($.proxy(this.keyPress_, this));
    }

    focus() {
        this.canvas.focus();
    }

    changeChar(char, x, y) {
        this.characterArray[y][x] = char + this.characterArray[y][x].slice(1);
    }

    changeColor(color, x, y) {
        this.characterArray[y][x] = this.characterArray[y][x][0] + color;
    }

    draw() {
        let ctx = this.canvas.getContext("2d");
        ctx.save()
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.font = "15px monospace";
        ctx.fillStyle = "#00FF00";

        ctx.scale(this.scale, this.scale);
        ctx.translate(this.translateX * 15, this.translateY * 15);

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
        else {
            ctx.strokeStyle = "#FF0000";
        } 
        this.drawPlayer_(ctx, this.playerPos);
    }

    drawPlayer_(ctx, player) {
        // draw a rectangle to highlight cursor
        let x = player[0] * 15 - 2;
        let y = player[1] * 15 + 2;
        ctx.beginPath();
        ctx.rect(x, y, 13, 15);
        ctx.stroke();
    }

    drawChar_(ctx, line, character) {
        ctx.fillStyle = this.characterArray[line][character].slice(1);
        ctx.fillText(
            this.characterArray[line][character][0],
            character * 15,
            (line * 15) + 15
        );     
    }

    keyPress_(event) {
        if (event.which == 58 && // : 
            event.shiftKey && 
            this.mode == "normal") {
            event.preventDefault();
            this.commandInput.focus();
        }
    }

    keyUp_(event) {   
        if (this.mode == "normal") {
            this.keyUpNormalMode_(event);
        }
        else if (this.mode == "insert") {
            this.keyUpInsertMode_(event);
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
                if (this.mode == "normal") {
                    this.mode = "insert";
                }
                break;
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
            case 189: // dash
                this.scale /= 2;
                break;
            case 187: // plus
                this.scale *= 2;
                break;
        }

        if (event.which >= 72 && event.which <= 76) {
            this.socket.send("move " + this.playerPos[0] + " " + this.playerPos[1])
        }
    }

    keyUpInsertMode_(event) {
        switch (event.which) {
            case 27: // escape
                if (this.mode == "insert") {
                    this.mode = "normal";
                }
                break;
        }
    }
}