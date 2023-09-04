const label = document.getElementById("label");
const input = document.getElementById("input");
const submit = document.getElementById("submit");
const executions = document.getElementById("executions");
const csv = document.getElementById("csv");

function capitalize(string) {
    return string.toLowerCase().replace(/(?:^|\s)\S(?=\S)|^\w$/g, x => x.toUpperCase());
}

class System {    
    transitions = {
        0: Object.fromEntries(destinations),
        1: {"VISTO": 4, "CIDADANIA": 4, "VOLTAR": 0},
        4: {"SOMENTE IDA": 6, "IDA E VOLTA": 5, "VOLTAR": 0},
        5: {"F": 10, "J": 10, "W": 10, "Y": 10, "VOLTAR": 4},
        6: {"F": 7, "J": 7, "W": 7, "Y": 7, "VOLTAR": 4},
        7: Object.fromEntries(months.map((m) => [m, 8]).concat([["VOLTAR", 6]])),
        8: Object.fromEntries([...Array(31).keys()].map((m) => [m + 1, 16])),
        10: Object.fromEntries(months.map((m) => [m, 11]).concat([["VOLTAR", 5]])),
        11: Object.fromEntries([...Array(31).keys()].map((m) => [m + 1, 13])),
        13: Object.fromEntries(months.map((m) => [m, 14]).concat([["VOLTAR", 10]])),
        14: Object.fromEntries([...Array(31).keys()].map((m) => [m + 1, 16])),
        16: {"DÉBITO": 20, "CRÉDITO": 18},
        18: Object.fromEntries([...Array(12).keys()].map(key => [(key + 1) + "X", 20]).concat([["VOLTAR", 16]]))
    };

    constructor() {
        this.resetState();
    }

    changeState(state) {
        this.state = state;
        label.innerHTML = labels[state] + ` [q${this.state}]`;
    }

    nextState(key) {
        if (key == "CANCELAR") {
            this.currentExecution.innerHTML += "<span class='success'>RESERVA CANCELADA</span>";
            system.resetState();
            return;
        }
        this.changeState(this.transitions[this.state][key]);
        let output = capitalize(key);
        if (system.state == undefined) {
            output = `<span class="error">${output} [ENTRADA INVÁLIDA]</span>`;
        }
        this.currentExecution.innerHTML += `${output}<br>`;
        if (system.state == 20) {
            system.currentExecution.innerHTML += "<span class='success'>RESERVA FINALIZADA</span>";
        }
    }

    resetState() {
        this.currentExecution = document.createElement("div");
        this.currentExecution.classList.add("execution");
        executions.appendChild(this.currentExecution);
        this.changeState(0);
    }
}

let system = new System();
console.log(system.transitions);

function processInput() {
        system.nextState(input.value.toUpperCase());
        if (system.state == undefined || system.state == 20) {
            system.resetState();
        }
        input.value = "";
}

input.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        processInput()
    }
});

function openFile(event) {

    var input = event.target;
    var reader = new FileReader();

    reader.readAsText(input.files[0]);

    if(input.files[0].type.includes("csv")){
        reader.onload = function(event){
            var text = event.target.result;
            var array = text.split(",")
            
            for (i = 0; i < array.length; i++){
                system.nextState(text.split(",")[i].toUpperCase())
            
                if (system.state == undefined || system.state == 20) {
                    system.resetState();
                    break;
                }     
            }
        };
    }
    setTimeout(() => { csv.value = "" }, 2000)
}