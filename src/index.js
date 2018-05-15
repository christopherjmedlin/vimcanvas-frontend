import './style/style.css';
import Logo from './img/logo.svg';
import $ from 'jquery';
import FakeTerminal from './terminal.js';
import commands from './commands.js';

function main() {
    let mainDiv = document.getElementById("mainDiv");
    mainDiv.style.height = window.innerHeight - 210 + "px";
    
    if (location.pathname == '/') {
        let term = new FakeTerminal("mainDiv", '$>', commands);
        term.init();

        $(window).resize(() => {
            document.getElementById("mainDiv").style.height = window.innerHeight - 210 + "px";
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});