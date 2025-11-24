const ACHIEVE_URL = "http://localhost:8001";
const achievementOutputContainer = document.getElementById("achieveData");
const refreshBtn = document.getElementById("refresh");

async function loadAchievements() {
  achievementOutputContainer.textContent = "Loading...";

  try {
    const res = await fetch(`${ACHIEVE_URL}/achievements`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    render(data);

  } catch (err) {
    achievementOutputContainer.textContent = "Failed: " + err.message;
  }
}

function render({ unlocked, locked, counters }) {
  achievementOutputContainer.innerHTML = `
    <h3>Unlocked</h3>
    ${
      unlocked.length 
        ? `<ul>${unlocked.map(a => `<li>${a.name}</li>`).join("")}</ul>`
        : `<p>None unlocked yet.</p>`
    }

    <h3>Locked</h3>
    <ul>${locked.map(a => `<li>${a.name}</li>`).join("")}</ul>

    <h3>Counters</h3>
    <ul>
      ${Object.entries(counters)
        .map(([key, value]) => `<li>${key}: ${value}</li>`)
        .join("")}
    </ul>
  `;
}

refreshBtn.addEventListener("click", loadAchievements);

// load once at page start
loadAchievements();
