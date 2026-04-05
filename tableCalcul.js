// Getters

function getMontantEmprunt() {
    return document.getElementById("montantEmprunt").value;
}

function getTauxInteret() {
    return document.getElementById("tauxInteret").value / 100 + 1;
}

function getDuration() {
    return document.getElementById("duration").value;
}

function getPeriodiciteRemboursement() {
    return document.getElementById("periodiciteRemboursement").value;
}

function roundTwoDigit(number) {
    return Number(number).toFixed(2);
}

// Calculate functions

function calculateTypeDelta(periodiciteRemboursement) {
    return {
        annuite: 'Années',
        trimestre: 'Trimestres',
        mensuel: 'Mois',
        semestre: 'Semestres'
    } [periodiciteRemboursement];
}

function calculateTauxInteret(tauxInteret, dividerDelta) {
    return tauxInteret ** (1 / dividerDelta) - 1;
}

function calculateDividerDelta(typeDelta) {
    return {
        'Trimestres': 4,
        'Mois': 12,
        'Semestres': 2
    } [typeDelta];
}

function calculateDurationCalculated(typeDelta, duration) {
    return {
        'Trimestres': duration * 3,
        'Mois': duration * 12,
        'Semestres': duration * 2
    } [typeDelta];
}

function calculateAnnuiteEmprunt(montantEmprunt, tauxInteret, duration) {
    return roundTwoDigit(montantEmprunt * (tauxInteret / (1 - (1 + tauxInteret) ** (-duration))));
}

function calculateLine(capitalFin, tauxInteret, annuiteEmprunt, sumInteret2) {
    let capitalDeb = roundTwoDigit(capitalFin);
    let interetPeriode = roundTwoDigit(capitalDeb * tauxInteret);
    let amortissementCapital = roundTwoDigit(annuiteEmprunt - interetPeriode);
    let capitalFin2 = roundTwoDigit(capitalDeb - amortissementCapital);
    let sumInteret = sumInteret2 + parseFloat(interetPeriode);
    return [capitalDeb, interetPeriode, amortissementCapital, capitalFin2, sumInteret]
}

// tableShow functions

function tableShowHeader(table, typeDelta, periodiciteRemboursement) {
    table.innerHTML = `
        <thead>
            <tr>
                <th>${typeDelta}</th>
                <th>Capital restant du en début de période</th>
                <th>Intérêts</th>
                <th>Amortissements</th>
                <th>${periodiciteRemboursement}</th>
                <th>Capital restant du en fin de période</th>
            </tr>
        </thead>
    `;
}

function tableShowLine(table, delta, capitalDeb, interetPeriode, amortissementCapital, annuiteEmprunt, capitalFin) {
    table.innerHTML += `
      <tbody>
        <tr>
          <th>${delta}</th>
          <td>${capitalDeb}</td>
          <td>${interetPeriode}</td>
          <td>${amortissementCapital}</td>
          <td>${annuiteEmprunt}</td>
          <td>${capitalFin}</td>
        </tr>
      </tbody>
    `;
}

function tableShowTotal(table, sumInteret, montantEmprunt, annuiteEmprunt, duration) {
    table.innerHTML += `
        <tbody>
            <tr>
                <th>Total</th>
                <td>-</td>
                <td>${roundTwoDigit(sumInteret)}</td>
                <td>${roundTwoDigit(montantEmprunt)}</td>
                <td>${roundTwoDigit(annuiteEmprunt * duration)}</td>
                <td>-</td>
            </tr>
        </tbody>
    `;
}

// Main function

const tableSection = document.getElementById("tableSection");
const startButton = document.getElementById("startButton");
const table = document.createElement("table");

startButton.addEventListener("click", () => {
    const montantEmprunt = getMontantEmprunt();
    const periodiciteRemboursement = getPeriodiciteRemboursement();
    let tauxInteret = getTauxInteret();
    const duration = getDuration();

    const typeDelta = calculateTypeDelta(periodiciteRemboursement);
    const dividerDelta = calculateDividerDelta(typeDelta);
    const durationCalculated = calculateDurationCalculated(typeDelta, duration);
    tauxInteret = calculateTauxInteret(tauxInteret, dividerDelta);
    const annuiteEmprunt = calculateAnnuiteEmprunt(montantEmprunt, tauxInteret, durationCalculated);

    tableShowHeader(table, typeDelta, periodiciteRemboursement)

    let capitalFin = montantEmprunt;
    let sumInteret = 0;
    for (let delta = 1; delta <= durationCalculated; delta++) {
        [capitalDeb, interetPeriode, amortissementCapital, capitalFin, sumInteret] =
        calculateLine(capitalFin, tauxInteret, annuiteEmprunt, sumInteret)
        tableShowLine(table, delta, capitalDeb, interetPeriode, amortissementCapital, annuiteEmprunt, capitalFin)
    }

    tableShowTotal(table, sumInteret, montantEmprunt, annuiteEmprunt, durationCalculated);

    tableSection.replaceChildren(table);
});