function roundTwoDigit(number) {
  return Number(number).toFixed(2);
}

const tableSection = document.getElementById("tableSection");
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", () => {
  // Fonction qui se lance quand l'utilisateur appuie sur le bouton
  // Lancement de la simulation

  const montantEmprunt = document.getElementById("montantEmprunt").value;
  let tauxInteret = document.getElementById("tauxInteret").value / 100 + 1;
  let duration = document.getElementById("duration").value;
  const periodiciteRemboursement = document.getElementById("periodiciteRemboursement").value;

  let table = document.createElement("table");

  // setup périodicité (année, mois...)
  const periodiciteMap = {
    annuite: 'Années',
    trimestre: 'Trimestres',
    mensuel: 'Mois',
    semestre: 'Semestres'
  };

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
  console.log(tauxInteret);

  // mise en place tableau
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

  let capitalFin = montantEmprunt;
  const annuiteEmprunt = roundTwoDigit(montantEmprunt * (tauxInteret / (1 - (1 + tauxInteret) ** (-duration))));
  let sumInteret = 0;

  for (let delta = 1; delta <= duration; delta++) {
    // un seul cycle, effectuée à chaque tour
    let capitalDeb = roundTwoDigit(capitalFin);
    let interetPeriode = roundTwoDigit(capitalDeb * tauxInteret);
    let amortissementCapital = roundTwoDigit(annuiteEmprunt - interetPeriode);
    capitalFin = roundTwoDigit(capitalDeb - amortissementCapital);

    if (delta == duration) {
      capitalFin = 0;
    }

    sumInteret += parseFloat(interetPeriode);

    // ajout 1 seule ligne
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

  // affichage ligne total
  table.innerHTML += `
    <tbody>
      <tr>
        <th>Total</th>
        <td>-</td>
        <td>${roundTwoDigit(sumInteret)}</td>
        <td>${montantEmprunt}</td>
        <td>${annuiteEmprunt * duration}</td>
        <td>-</td>
      </tr>
    </tbody>`;

  // document.body.append(table);
  tableSection.replaceChildren(table);
});