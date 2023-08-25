const label = document.getElementById("label");
const input = document.getElementById("input");
const submit = document.getElementById("submit");
const execution = document.getElementById("execution");

class System {    
    transitions = {
        0: Object.fromEntries(destinations.map(d => [d, 1])),
        1: {"Visto": 2, "Cidadania": 3, "Voltar": 0}
    };

    constructor() {
        this.state = 0;
    }

    changeState(state) {
        this.state = state;
        label.innerHTML = labels[state];

    }

    nextState(key) {
        execution.innerHTML += `${key}<br>`;
        this.changeState(this.transitions[this.state][key]);
    }

    resetState() {
        execution.innerHTML = "";
        this.changeState(0);
    }
}

let system = new System();

function processInput() {
    let previousState = system.state
    system.nextState(input.value);
    if (system.state == undefined) {
        window.alert(`ERRO: "${input.value}" não é uma entrada válida no estado ${previousState}`);
        system.resetState();
    }
    input.value = "";
    console.log(`${previousState} -> ${system.state}`);
}

input.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        processInput()
    }
});