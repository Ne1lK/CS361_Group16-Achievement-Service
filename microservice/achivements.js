const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// tracking/storing everything (achievement counters + unlocked list)
let achievementState = {
  counters: {
    searches: 0,
    clicks: 0
  },
  unlocked: []
};

// Achievement rules - when adding new events add the achievement and condition here.
const achievements = [
  { id: 'test1', name: 'achievement test1', check: s => s.counters.searches >= 1 }
];

// Check and unlock achievements
function checkAchievements() {
  for (const achievement of achievements) {
    if (!achievementState.unlocked.includes(achievement.id) && achievement.check(achievementState)) {
      achievementState.unlocked.push(achievement.id);
    }
  }
}

app.get('/achievements', (req, res) => {
  const unlocked = achievements.filter(achievement => achievementState.unlocked.includes(achievement.id));
  const locked = achievements.filter(achievement => !achievementState.unlocked.includes(achievement.id));
  res.json({ unlocked, locked, counters: achievementState.counters });
});

app.post('/events', (req, res) => {
  const { type } = req.body || {};
  if (!type) return res.status(400).json({ error: 'Missing event type' });

  processEvent(type);
  res.json({ ok: true, counters: achievementState.counters, unlocked: achievementState.unlocked });
});

// Update counters
function processEvent(type) {
  if (type === 'search') {
    achievementState.counters.searches++;
  }
  if (type === 'click') {
    achievementState.counters.clicks++;
  }

  checkAchievements();
}

app.listen(PORT, () => {
  console.log(`Achievement Service running on port ${PORT}`);
});
