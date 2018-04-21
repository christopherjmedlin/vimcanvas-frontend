function quit(runner, args) {
    runner.canvas.tearDown();
    runner.terminal.show();
    runner.terminal.focus();
}

function move(runner, args) {
    runner.canvas.playerPos[0] = Number(args[0])
    runner.canvas.playerPos[1] = Number(args[1])
}

let canvasCommands = {
    "q": quit,
    "wq": quit,
    "x": quit,
    "move": move
};

export default canvasCommands;