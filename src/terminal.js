// not copied, but took cues from this codepen - https://codepen.io/AndrewBarfield/pen/qEqWMq
export default class FakeTerminal {

    constructor(containerID, prompt, commands={}) {
        this.container = document.getElementById(containerID);
        this.promptString = prompt;
        this.elements = {};
        this.commands = commands;
    }

    init() {
        let wrapperDiv = document.createElement('div');
        wrapperDiv.className = "fakeTerm";
        this.container.appendChild(wrapperDiv);
        this.elements['wrapperDiv'] = wrapperDiv;

        let output = document.createElement('output');
        wrapperDiv.appendChild(output);
        this.elements['output'] = output;

        let inputLineDiv = document.createElement('div');
        inputLineDiv.className = "inputLineDiv";
        wrapperDiv.appendChild(inputLineDiv);
        this.elements['inputLineDiv'] = inputLineDiv;

        let prompt = document.createElement('div');
        prompt.innerHTML = this.promptString;
        prompt.className = "prompt";
        inputLineDiv.appendChild(prompt);
        this.elements['prompt'] = prompt;
        
        let inputLine = document.createElement('input');
        inputLineDiv.appendChild(inputLine);
        this.elements['inputLine'] = inputLine;
        
        $(inputLine).keydown($.proxy(this.handleKeypress_, this));
        inputLine.focus();
    }

    tearDown() {
        this.container.removeChild(this.elements['wrapperDiv']);
    }

    addCommand(name, action) {
        this.commands[name] = action;
    }

    runCommand() {
        let line = this.elements["inputLineDiv"].cloneNode(true);
        this.elements["output"].append(line);

        let input = this.elements['inputLine'].value.split(" ");
        if (input[0] in this.commands)
            this.commands[input[0]](this, input.slice(1));
        else
            this.output("'" + input[0] + "' is not a command. Type 'help' for more information.");

        this.elements["inputLine"].value = "";
        this.container.scrollTop = this.container.scrollHeight;
    }

    output(message) {
        this.elements["output"].insertAdjacentHTML("beforeend", message + "<br>")
        this.container.scrollTop = this.container.scrollHeight;
    }

    handleKeypress_(event) {
        //enter
        if (event.which == 13) {
            this.runCommand();
        }
    }
}