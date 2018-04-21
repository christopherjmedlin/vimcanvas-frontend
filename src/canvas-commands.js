function quit(runner, args) {
    runner.canvas.tearDown();
    runner.terminal.show();
    runner.terminal.focus();
}

function move(runner, args) {
    runner.canvas.playerPos[0] = Number(args[0])
    runner.canvas.playerPos[1] = Number(args[1])
}

function location(runner, args) {
    let output = "x: " + runner.canvas.playerPos[0] +
             ", y: " + runner.canvas.playerPos[1];
    runner.output(output);
}

let canvasCommands = {
    "q": quit,
    "wq": quit,
    "x": quit,
    "move": move,
    "location": location
};

export default canvasCommands;