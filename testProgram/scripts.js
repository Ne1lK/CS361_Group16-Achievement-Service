const achivementHost = 'http://localhost:8001';

// HTTP POST
// Sends data to dashboard or Host, not test
async function sendAchievement(type) {
  const res = await fetch(`${achivementHost}/events`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }

  return res.json();
}

async function loadAchievements() {
  const res = await fetch(`${achivementHost}/achievements`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

document.addEventListener("DOMContentLoaded", () => {
  const eventButton = document.getElementById("eventButton");
  const fetchButton = document.getElementById("fetchButton");
  const output = document.getElementById("output");

  //send achivement to dashboard
  eventButton.onclick = async () => {
    output.textContent = "Sending event...";

    try {
      const data = await sendAchievement("search");
      output.textContent = "Event sent:\n" + JSON.stringify(data, null, 2);
    } catch (err) {
      output.textContent = "Error: " + err.message;
    }
  };

  // fetch achievements
  fetchButton.onclick = async () => {
    output.textContent = "Fetching achievements...";

    try {
      const data = await loadAchievements();
      output.textContent = "Achievements:\n" + JSON.stringify(data, null, 2);
    } catch (err) {
      output.textContent = "Failed: " + err.message;
    }
  };
});