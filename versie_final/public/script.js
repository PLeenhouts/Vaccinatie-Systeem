const bezoekers = ["Persoon 1", "Persoon 2", "Persoon 3", "Persoon 4", "Persoon 5"];
let statusData = JSON.parse(localStorage.getItem("statusData")) || {};

bezoekers.forEach(naam => {
  if (!statusData.hasOwnProperty(naam)) {
    statusData[naam] = "Nee";
  }
});
localStorage.setItem("statusData", JSON.stringify(statusData));

function laadBezoekers() {
  const lijst = document.getElementById("visitorList");
  lijst.innerHTML = "";

  bezoekers.forEach(naam => {
    const li = document.createElement("li");
    const naamTekst = document.createTextNode(naam + " ");
    li.appendChild(naamTekst);

    const vaccinKnop = document.createElement("button");
    vaccinKnop.innerText = "Vaccineren";
    li.appendChild(vaccinKnop);

    const status = document.createElement("span");
    status.style.marginLeft = "10px";
    status.innerText = statusData[naam];
    li.appendChild(status);

    const resetKnop = document.createElement("button");
    resetKnop.innerText = "Reset";
    resetKnop.style.marginLeft = "10px";
    li.appendChild(resetKnop);

    vaccinKnop.addEventListener("click", () => {
      const wachtwoord = prompt("Voer wachtwoord in:");
      if (wachtwoord === "test") {
        status.innerText = "Ja";
        statusData[naam] = "Ja";
        localStorage.setItem("statusData", JSON.stringify(statusData));
      } else {
        alert("Onjuist wachtwoord!");
      }
    });

    resetKnop.addEventListener("click", () => {
      const wachtwoord = prompt("Voer wachtwoord in:");
      if (wachtwoord === "test") {
        status.innerText = "Nee";
        statusData[naam] = "Nee";
        localStorage.setItem("statusData", JSON.stringify(statusData));
      } else {
        alert("Onjuist wachtwoord!");
      }
    });

    lijst.appendChild(li);
  });
}
laadBezoekers();


let afspraken = [];
let editIndex = null;

window.onload = () => {
  const opgeslagen = localStorage.getItem("afspraken");
  if (opgeslagen) {
    afspraken = JSON.parse(opgeslagen).map(a => ({
      ...a,
      tijd: new Date(a.tijd),
      reminderTijd: new Date(a.reminderTijd),
      timeoutId: planReminder(a)
    }));
    toonAfspraken();
  }
};

function planAfspraak() {
  const naam = document.getElementById("naam").value.trim();
  const onderwerp = document.getElementById("onderwerp").value.trim();
  const tijd = new Date(document.getElementById("tijd").value);

  if (!naam || !onderwerp || isNaN(tijd)) {
    alert("Vul alle velden correct in!");
    return;
  }

  const reminderTijd = new Date(tijd.getTime() - 15 * 60000);
  const now = new Date();
  const msTotReminder = reminderTijd - now;

  if (msTotReminder <= 0) {
    alert("Deze afspraak is te dichtbij, reminder kan niet worden ingesteld.");
    return;
  }

  const afspraak = {
    naam,
    onderwerp,
    tijd,
    reminderTijd,
    timeoutId: null
  };

  afspraak.timeoutId = planReminder(afspraak);
  afspraken.push(afspraak);
  opslaan();
  toonAfspraken();

  document.getElementById("status").textContent =
    `Afspraak voor ${naam} (${onderwerp}) ingepland op ${tijd.toLocaleTimeString()}. Reminder komt om ${reminderTijd.toLocaleTimeString()}.`;
  resetForm();
}

function planReminder(afspraak) {
  const msTotReminder = afspraak.reminderTijd - new Date();
  if (msTotReminder > 0) {
    return setTimeout(() => {
      alert(`Herinnering voor ${afspraak.naam}: je afspraak (${afspraak.onderwerp}) is om ${afspraak.tijd.toLocaleTimeString()}`);
    }, msTotReminder);
  }
  return null;
}

function toonAfspraken() {
  const tbody = document.querySelector("#afsprakenTabel tbody");
  tbody.innerHTML = "";
  afspraken.forEach((a, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${a.naam}</td>
      <td>${a.onderwerp}</td>
      <td>${a.tijd.toLocaleString()}</td>
      <td>${a.reminderTijd.toLocaleTimeString()}</td>
      <td>
        <button onclick="bewerkAfspraak(${index})">Bewerken</button>
        <button onclick="verwijderAfspraak(${index})">Verwijderen</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function verwijderAfspraak(index) {
  clearTimeout(afspraken[index].timeoutId);
  afspraken.splice(index, 1);
  opslaan();
  toonAfspraken();
  document.getElementById("status").textContent = "Afspraak verwijderd.";
  resetForm();
}

function bewerkAfspraak(index) {
  const afspraak = afspraken[index];
  document.getElementById("naam").value = afspraak.naam;
  document.getElementById("onderwerp").value = afspraak.onderwerp;
  document.getElementById("tijd").value = afspraak.tijd.toISOString().slice(0, 16);
  editIndex = index;
  document.querySelector("button[onclick='planAfspraak()']").style.display = "none";
  document.getElementById("updateBtn").style.display = "inline-block";
  document.getElementById("status").textContent = "Je bewerkt nu een afspraak.";
}

function updateAfspraak() {
  const naam = document.getElementById("naam").value.trim();
  const onderwerp = document.getElementById("onderwerp").value.trim();
  const tijd = new Date(document.getElementById("tijd").value);
  if (!naam || !onderwerp || isNaN(tijd)) {
    alert("Vul alle velden correct in!");
    return;
  }

  clearTimeout(afspraken[editIndex].timeoutId);
  const reminderTijd = new Date(tijd.getTime() - 15 * 60000);
  const afspraak = {
    naam,
    onderwerp,
    tijd,
    reminderTijd,
    timeoutId: null
  };
  afspraak.timeoutId = planReminder(afspraak);
  afspraken[editIndex] = afspraak;
  opslaan();
  toonAfspraken();

  document.getElementById("status").textContent =
    `Afspraak geüpdatet voor ${naam} (${onderwerp}) om ${tijd.toLocaleTimeString()}.`;
  resetForm();
}

function resetForm() {
  document.getElementById("naam").value = "";
  document.getElementById("onderwerp").value = "";
  document.getElementById("tijd").value = "";
  editIndex = null;
  document.querySelector("button[onclick='planAfspraak()']").style.display = "inline-block";
  document.getElementById("updateBtn").style.display = "none";
}

function opslaan() {
  const opslagData = afspraken.map(a => ({
    naam: a.naam,
    onderwerp: a.onderwerp,
    tijd: a.tijd,
    reminderTijd: a.reminderTijd
  }));
  localStorage.setItem("afspraken", JSON.stringify(opslagData));
}