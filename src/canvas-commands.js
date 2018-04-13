function quit(runner, args) {
    runner.canvas.tearDown();
    runner.terminal.show();
}

let canvasCommands = {
    "q": quit
};

export default canvasCommands;