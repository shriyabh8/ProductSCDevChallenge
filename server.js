const path = require('path');
const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

const app = express();
const port = process.env.PORT || 4173;
const db = new Database(path.join(__dirname, 'netflix-prototype.db'));
const sessions = new Map();

app.use(express.json());
app.use(express.static(__dirname));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    initial TEXT NOT NULL,
    color TEXT NOT NULL,
    matches_json TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

const demoEmail = 'demo@netflix.local';
const demoPasswordHash = bcrypt.hashSync('password123', 12);
let demoUser = db.prepare('SELECT id FROM users WHERE email = ?').get(demoEmail);
if (!demoUser) {
  const result = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(demoEmail, demoPasswordHash);
  demoUser = { id: result.lastInsertRowid };
}
const profileCount = db.prepare('SELECT COUNT(*) AS count FROM profiles WHERE user_id = ?').get(demoUser.id).count;
if (!profileCount) {
  const matches = [
    { 'The Last Voyage': 96, 'Neon Divide': 88, Afterlight: 83, 'Lucky Break': 72, 'The Quiet House': 68, 'Orbit 9': 93, 'Small Victories': 76, 'Blue Hour': 91, 'Signal Lost': 85, 'The Long Weekend': 74, Wildflower: 94, 'First Contact': 87, 'Paper Planes': 71, 'North Country': 89 },
    { 'The Last Voyage': 90, 'Neon Divide': 94, Afterlight: 76, 'Lucky Break': 75, 'The Quiet House': 72, 'Orbit 9': 89, 'Small Victories': 81, 'Blue Hour': 86, 'Signal Lost': 78, 'The Long Weekend': 80, Wildflower: 91, 'First Contact': 92, 'Paper Planes': 73, 'North Country': 84 },
    { 'The Last Voyage': 88, 'Neon Divide': 91, Afterlight: 74, 'Lucky Break': 83, 'The Quiet House': 71, 'Orbit 9': 95, 'Small Victories': 78, 'Blue Hour': 79, 'Signal Lost': 82, 'The Long Weekend': 77, Wildflower: 89, 'First Contact': 90, 'Paper Planes': 80, 'North Country': 86 }
  ];
  const seed = db.prepare('INSERT INTO profiles (user_id, name, initial, color, matches_json) VALUES (?, ?, ?, ?, ?)');
  [['Jordan', 'J', '#bd7961'], ['Maya', 'M', '#74968d'], ['Sam', 'S', '#9b7aab']].forEach((profile, index) => seed.run(demoUser.id, profile[0], profile[1], profile[2], JSON.stringify(matches[index])));
}

function profileRecord(row) {
  return { id: row.id, name: row.name, initial: row.initial, color: row.color, matches: JSON.parse(row.matches_json) };
}
function authUser(request) {
  const token = request.headers.authorization?.replace('Bearer ', '');
  const userId = token && sessions.get(token);
  return userId ? { id: userId, token } : null;
}
function requireAuth(request, response, next) {
  const user = authUser(request);
  if (!user) return response.status(401).json({ error: 'Authentication required' });
  request.user = user;
  next();
}

app.post('/api/auth/login', (request, response) => {
  const { email, password } = request.body || {};
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(String(email || '').toLowerCase().trim());
  if (!user || !bcrypt.compareSync(String(password || ''), user.password_hash)) return response.status(401).json({ error: 'Invalid email or password' });
  const token = crypto.randomUUID();
  sessions.set(token, user.id);
  const profiles = db.prepare('SELECT * FROM profiles WHERE user_id = ? ORDER BY id').all(user.id).map(profileRecord);
  response.json({ token, user: { email: user.email }, profiles });
});

app.get('/api/profiles', requireAuth, (request, response) => {
  const profiles = db.prepare('SELECT * FROM profiles WHERE user_id = ? ORDER BY id').all(request.user.id).map(profileRecord);
  response.json({ profiles });
});

app.post('/api/profiles', requireAuth, (request, response) => {
  const name = String(request.body?.name || '').trim().slice(0, 16);
  if (!name) return response.status(400).json({ error: 'A profile name is required' });
  const base = db.prepare('SELECT matches_json FROM profiles WHERE user_id = ? ORDER BY id LIMIT 1').get(request.user.id);
  const initial = name[0].toUpperCase();
  const result = db.prepare('INSERT INTO profiles (user_id, name, initial, color, matches_json) VALUES (?, ?, ?, ?, ?)').run(request.user.id, name, initial, '#d39d62', base.matches_json);
  const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(result.lastInsertRowid);
  response.status(201).json({ profile: profileRecord(profile) });
});

app.post('/api/auth/logout', requireAuth, (request, response) => {
  sessions.delete(request.user.token);
  response.status(204).end();
});

app.listen(port, () => console.log(`Netflix prototype running at http://localhost:${port}`));
