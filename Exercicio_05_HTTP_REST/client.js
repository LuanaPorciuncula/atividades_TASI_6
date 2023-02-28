const axios = require('axios').default;
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const urlServer = 'http://127.0.0.1:4000';

function readPeriods() {
    axios.get(urlServer + '/readPeriods')
        .then(function (response) {
            console.log("---------- LISTA DE PERIODOS ----------");
            response.data.periodos.forEach(periodo => {
                console.log("\n" + periodo.periodo);
                periodo.detalhes.forEach(disciplina => {
                    console.log(disciplina.disciplina + " ---- crédito da disciplina: "+ disciplina['crédito']);
                })
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

function createPeriod(newPeriod) {
    axios.post(urlServer + '/createPeriod', newPeriod)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}


function updatePeriod(editedPeriod) {
    axios.put(urlServer + '/updatePeriod', editedPeriod)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}


function deletePeriod(period_id) {
    var period = {
        "periodo": period_id
    }

    axios.delete(urlServer + '/deletePeriod', { data: period })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}

var newPeriod = {
    "periodo": "2022.2",
    "detalhes": [
        {
            "disciplina": "EDF0025 - MODALIDADE DO ESPORTE COLETIVO - VOLEIBOL",
            "crédito": 3
        },
        {
            "disciplina": "IF1015 - TÓPICOS AVANÇADOS EM SI 6",
            "crédito": 4
        }
    ]
}

var editedPeriod = {
    "periodo": "2022.2",
    "detalhes": [
        {
            "disciplina": "EDF0025 - MODALIDADE DO ESPORTE COLETIVO - VOLEIBOL",
            "crédito": 3
        },
        {
            "disciplina": "IF1015 - TÓPICOS AVANÇADOS EM SI 6 (HACKATHON)",
            "crédito": 10
        }
    ]
}
var period_id = "2022.2";


console.log("1 - ler periodos da lista");
console.log("2 - criar um novo periodo (2022.2)");
console.log("3 - atualizar um periodo (2022.2)");
console.log("4 - deletar um periodo (2022.2)");
console.log("Digite o número da operação a ser realizada: ");

rl.addListener('line', line => {
    switch (line) {
        case "1":
            readPeriods();
            break;
        case "2":
            createPeriod(newPeriod);
            break;
        case "3":
            updatePeriod(editedPeriod);
            break;
        case "4":
            deletePeriod(period_id);
            break;
        default:
            console.log("Número não reconhecido, digite 1, 2, 3 ou 4: ");
            break;
    }
})