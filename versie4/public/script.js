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
    vaccinKnop.innerText = "Vaccineren succesvol?";
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
        alert(`${naam} — is gevaccineerd!`);
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
        alert(`${naam} — vaccinatiestatus is gereset!`);
      } else {
        alert("Onjuist wachtwoord!");
      }
    });

    lijst.appendChild(li);
  });
}
laadBezoekers();