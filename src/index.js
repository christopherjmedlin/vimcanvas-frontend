import './style/style.css';
import Logo from './img/logo.svg';
import $ from 'jquery';
import FakeTerminal from './terminal.js';
import commands from './commands.js';

function logo() {
    var logo = new Image();

    logo.id = 'logo';
    logo.src = Logo;

    return logo;
}

function main() {
    let mainDiv = document.getElementById("mainDiv");
    mainDiv.style.height = window.innerHeight - 190 + "px";
    $(logo()).insertBefore(mainDiv);
    
    let term = new FakeTerminal("mainDiv", '$>', commands);
    term.init();

    $(window).resize(() => {
        document.getElementById("mainDiv").style.height = window.innerHeight - 190 + "px";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});