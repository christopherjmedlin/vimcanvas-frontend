function sendCharChangeMessage(command, val, playerPos, highlightPos, socket) {
    let width = Math.abs(playerPos[0] - highlightPos[0]) + 1;
    let height = Math.abs(playerPos[1] - highlightPos[1]) + 1;

    let x = Math.min(playerPos[0], highlightPos[0]);
    let y = Math.min(playerPos[1], highlightPos[1]);

    let message = command + " " + x + " " + y + " " + val + " " + width + " " + height;
    socket.send(message);
}

function quit(runner, args) {
    runner.canvas.tearDown();
    runner.canvas.terminal.show();
    runner.canvas.terminal.focus();
}

function move(runner, args) {
    runner.display.playerPos[0] = Number(args[0])
    runner.display.playerPos[1] = Number(args[1])

    runner.display.socket.send(
        "move " + runner.display.playerPos[0] + " " + runner.display.playerPos[1]
    )
}

function color(runner, args) {
    /*
    let width = Math.abs(runner.display.playerPos[0] - runner.display.highlightPos[0]) + 1;
    let height = Math.abs(runner.display.playerPos[1] - runner.display.highlightPos[1]) + 1;
    runner.display.socket.send("color " + runner.display.playerPos[0] + " " + 
                               runner.display.playerPos[1] + " " + args[0] + " " +
                               width + " " + height);
    */
    sendCharChangeMessage("color", args[0],
                          runner.display.playerPos, 
                          runner.display.highlightPos, 
                          runner.display.socket)
}

function char(runner, args) {
    // let width = Math.abs(runner.display.playerPos[0] - runner.display.highlightPos[0]) + 1;
    // let height = Math.abs(runner.display.playerPos[1] - runner.display.highlightPos[1]) + 1;
    // runner.display.socket.send("char " + runner.display.playerPos[0] + " " +
    //                             runner.display.playerPos[1] + " " + args[0] + " " +
    //                             width + " " + height);
    sendCharChangeMessage("char", args[0],
                          runner.display.playerPos, 
                          runner.display.highlightPos, 
                          runner.display.socket)
}

function location(runner, args) {
    let output = "x: " + runner.display.playerPos[0] +
             ", y: " + runner.display.playerPos[1];
    runner.output(output);
}

let canvasCommands = {
    "q": quit,
    "wq": quit,
    "x": quit,
    "move": move,
    "color": color,
    "char": char,
    "location": location
};

export default canvasCommands;