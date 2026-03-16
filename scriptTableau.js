function roundTwoDigit(number) {
  return Number(number).toFixed(2);
}

const periodiciteMap = {
  annuite: 'Années',
  trimestre: 'Trimestres',
  mensuel: 'Mois',
  semestre: 'Semestres'
};

const tableSection = document.getElementById("tableSection");
const startButton = document.getElementById("startButton");
const table = document.createElement("table");

startButton.addEventListener("click", () => {
  const montantEmprunt = document.getElementById("montantEmprunt").value;
  let tauxInteret = document.getElementById("tauxInteret").value / 100 + 1;
  let duration = document.getElementById("duration").value;
  const periodiciteRemboursement = document.getElementById("periodiciteRemboursement").value;

  const typeDelta = periodiciteMap[periodiciteRemboursement];
  let dividerDelta = 1;

  switch (typeDelta) {
    case 'Trimestres':
      duration = duration * 3;
      dividerDelta = 4;
      break;
    case 'Mois':
      duration = duration * 12;
      dividerDelta = 12;
      break;
    case 'Semestres':
      duration = duration * 2;
      dividerDelta = 2;
      break;
  }

  tauxInteret = tauxInteret ** (1 / dividerDelta) - 1;
  const annuiteEmprunt = roundTwoDigit(montantEmprunt * (tauxInteret / (1 - (1 + tauxInteret) ** (-duration))));

  // HEADER TABLEAU
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
    </thead>`;

  // CALCUL PAR LIGNES
  let capitalFin = montantEmprunt;
  let sumInteret = 0;
  for (let delta = 1; delta <= duration; delta++) {
    let capitalDeb = roundTwoDigit(capitalFin);
    let interetPeriode = roundTwoDigit(capitalDeb * tauxInteret);
    let amortissementCapital = roundTwoDigit(annuiteEmprunt - interetPeriode);
    capitalFin = roundTwoDigit(capitalDeb - amortissementCapital);
    sumInteret += parseFloat(interetPeriode);

    // AJOUT LIGNE DU CYCLE
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
      </tbody>`;
  }

  // MIS A ZERO DU CAPITAL RESTANT DU A LA FIN
  table.rows[table.rows.length-1].cells[5].textContent = 0;

  // LIGNE TOTAL
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
    </tbody>`;

  tableSection.replaceChildren(table);
});