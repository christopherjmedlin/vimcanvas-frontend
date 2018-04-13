function quit(runner, args) {
    runner.canvas.tearDown();
    runner.terminal.show();
    runner.terminal.focus();
}

let canvasCommands = {
    "q": quit,
    "wq": quit,
    "x": quit
};

export default canvasCommands;