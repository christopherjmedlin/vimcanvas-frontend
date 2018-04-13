import CommandRunner from "./runner";

// not copied, but took cues from this codepen - https://codepen.io/AndrewBarfield/pen/qEqWMq
export default class FakeTerminal extends CommandRunner {

    constructor(containerID, prompt, commands={}) {
        super(commands);
        this.container = document.getElementById(containerID);
        this.promptString = prompt;
        this.elements = {};
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

    hide() {
        this.elements['wrapperDiv'].style.display = "none";
    }

    show() {
        this.elements['wrapperDiv'].style.display = "block";
    }

    addCommand(name, action) {
        this.commands[name] = action;
    }

    runCommand() {
        let line = this.elements["inputLineDiv"].cloneNode(true);
        line.getElementsByTagName("input").disabled = true;
        this.elements["output"].append(line);

        super.runCommand(this.elements['inputLine'].value);

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