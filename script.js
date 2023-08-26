const label = document.getElementById("label");
const input = document.getElementById("input");
const submit = document.getElementById("submit");
const execution = document.getElementById("execution");

class System {    
    transitions = {
        0: Object.fromEntries(destinations),
        1: {"VISTO": 4, "CIDADANIA": 4},
        4: {"SOMENTE IDA": 6, "IDA E VOLTA": 5, "VOLTAR": 0},
        5: {"F": 10, "J": 10, "W": 10, "Y": 10, "VOLTAR": 4},
        6: {"F": 7, "J": 7, "W": 7, "Y": 7, "VOLTAR": 4},
        7: Object.fromEntries(months.map((m) => [m, 8]).concat([["VOLTAR", 6]])),
        8: Object.fromEntries([...Array(31).keys()].map((m) => [m, 16])),
        10: Object.fromEntries(months.map((m) => [m, 11]).concat([["VOLTAR", 5]])),
        11: Object.fromEntries([...Array(31).keys()].map((m) => [m, 13])),
        13: Object.fromEntries(months.map((m) => [m, 14]).concat([["VOLTAR", 10]])),
        14: Object.fromEntries([...Array(31).keys()].map((m) => [m, 16])),
        16: {"DÉBITO": 20, "CRÉDITO": 18},
        17: Object.fromEntries([...Array(12).keys()].map(key => [(key + 1) + "X", 20]).concat([["VOLTAR", 16]]))
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
        this.changeState(this.transitions[this.state][key.toUpperCase()]);
    }

    resetState() {
        execution.innerHTML = "";
        this.changeState(0);
    }
}

let system = new System();
console.log(system.transitions);

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