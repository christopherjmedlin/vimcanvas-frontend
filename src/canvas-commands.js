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
    runner.display.socket.send("color " + runner.display.playerPos[0] + " " + 
                               runner.display.playerPos[1] + " " + args[0])
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
    "location": location
};

export default canvasCommands;