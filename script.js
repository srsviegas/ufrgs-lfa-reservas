const label = document.getElementById("label");
const input = document.getElementById("input");
const submit = document.getElementById("submit");
const executions = document.getElementById("executions");
const csv = document.getElementById("csv");

/**
 * Capitalizes the first letter of each word in a string.
 * @param {string} string - The input string.
 * @returns {string} The string with the starting letter of each word capitalized.
 */
function capitalize(string) {
    return string.toLowerCase().replace(/(?:^|\s)\S(?=\S)|^\w$/g, x => x.toUpperCase());
}

/**
 * Checks if the given day is within the valid range for the given month.
 * @param {string} month - The name of the month to check.
 * @param {number} day - The number of the day to check.
 * @returns {boolean} True if the day is a valid input for the month, false otherwise.
 */
function isValidDay(month, day) {
    return (day > 0) && (day <= Object.fromEntries(months)[month]);
}

class System {
    // Dictionary containing all of the system's possible transitions.
    transitions = {
        0: Object.fromEntries(destinations),
        1: {"VISTO": 4, "CIDADANIA": 4, "VOLTAR": 0},
        4: {"SOMENTE IDA": 6, "IDA E VOLTA": 5, "VOLTAR": 0},
        5: {"F": 10, "J": 10, "W": 10, "Y": 10, "VOLTAR": 4},
        6: {"F": 7, "J": 7, "W": 7, "Y": 7, "VOLTAR": 4},
        7: Object.fromEntries(months.map((m) => [m[0], 8]).concat([["VOLTAR", 6]])),
        8: Object.fromEntries([...Array(31).keys()].map((m) => [m + 1, 9])),
        9: {"DATA OK": 16},
        10: Object.fromEntries(months.map((m) => [m[0], 11]).concat([["VOLTAR", 5]])),
        11: Object.fromEntries([...Array(31).keys()].map((m) => [m + 1, 12])),
        12: {"DATA OK": 13},
        13: Object.fromEntries(months.map((m) => [m[0], 14]).concat([["VOLTAR", 10]])),
        14: Object.fromEntries([...Array(31).keys()].map((m) => [m + 1, 15])),
        15: {"DATA OK": 16},
        16: {"DÉBITO": 20, "CRÉDITO": 18},
        18: Object.fromEntries([...Array(12).keys()].map(key => [(key + 1) + "X", 20]).concat([["VOLTAR", 16]]))
    };

    /**
     * Initializes the System instance and resets its state to q0.
     */
    constructor() {
        this.resetState();
    }

    /**
     * Changes the state of the system to the specified state and updates the DOM label.
     * @param {number} state - The number representing the next state of the system.
     */
    changeState(state) {
        this.state = state;
        label.innerHTML = labels[state] + ` [q${this.state}]`;
    }

    /**
     * Advances the state of the system using the transitions table.
     * @param {string} key - The string representing the transition to the next state.
     */
    nextState(key) {
        if (key == "CANCELAR") {
            this.currentExecution.innerHTML += "<span class='success'>RESERVA CANCELADA</span>";
            system.resetState();
            return;
        }
        // Gets the next state of the system from the transitions table.
        try {
            this.changeState(this.transitions[this.state][key]);
        } catch {
            this.state = undefined;
        }
        let output = capitalize(key);
        if (system.state == undefined) {
            output = `<span class="error">${output} [ENTRADA INVÁLIDA]</span>`;
        }
        if (key == "DATA OK") {
            output = `<span class="success">${output}</span>`;
        }
        this.currentExecution.innerHTML += `${output}<br>`;
        if (system.state == 20) {
            system.currentExecution.innerHTML += "<span class='success'>RESERVA FINALIZADA</span><br>";
        }
        else if ([9, 12, 15].includes(this.state)) {
            const inputHistory = this.currentExecution.innerHTML.split("<br>").splice(-3);
            if (isValidDay(inputHistory[0].toUpperCase(), Number(inputHistory[1]))) {
                this.nextState("DATA OK");
            }
            else {
                this.nextState("DATA INVÁLIDA");
            }
        }
    }

    /**
     * Resets the state of the system to q0 and initializes a new execution display block.
     */
    resetState() {
        this.currentExecution = document.createElement("div");
        this.currentExecution.classList.add("execution");
        executions.appendChild(this.currentExecution);
        this.changeState(0);
    }
}

let system = new System();
console.log(system.transitions);

/**
 * Processes user input by advancing the system state based on the input value.
 */
function processInput() {
    system.nextState(input.value.toUpperCase());
    // Resets the system after reaching an undefined or final state
    if (system.state == undefined || system.state == 20) {
        system.resetState();
    }
    input.value = "";
}

/**
 * Opens a CSV file and executes the system using the entries inside it as input.
 * @param {Event} event The event object created when an input file is selected.
 */
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
                if (system.state == undefined) {
                    break;
                }
            }
            if (system.state != 20 && system.state != undefined) {
                system.currentExecution.innerHTML += "<span class='error'>ENTRADA INCOMPLETA</span><br>";
            }
            system.resetState();
        };
    }
    setTimeout(() => { csv.value = "" }, 2000)
}

// Event listener for the "Enter" key press in the input field
input.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        processInput()
    }
});