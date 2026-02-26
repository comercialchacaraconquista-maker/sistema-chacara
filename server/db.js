const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const run = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const all = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

async function initializeDatabase() {
  console.log('Inicializando Tabelas...');
  try {
    await run(`CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT,
      document TEXT,
      phone TEXT,
      email TEXT,
      city TEXT,
      totalSpent REAL DEFAULT 0,
      lastEvent TEXT,
      status TEXT DEFAULT 'Ativo'
    )`);

    await run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      start TEXT,
      end TEXT,
      startDate TEXT,
      endDate TEXT,
      guests INTEGER,
      type TEXT,
      status TEXT,
      client_id INTEGER,
      basePrice REAL,
      paymentMethod TEXT,
      isProposal INTEGER DEFAULT 0,
      extras TEXT,
      FOREIGN KEY (client_id) REFERENCES clients (id)
    )`);

    // Migration for existing databases
    try {
      await run(`ALTER TABLE events ADD COLUMN startDate TEXT`);
    } catch (e) { }
    try {
      await run(`ALTER TABLE events ADD COLUMN endDate TEXT`);
    } catch (e) { }
    try {
      await run(`ALTER TABLE events ADD COLUMN paymentMethod TEXT`);
    } catch (e) { }
    try {
      await run(`ALTER TABLE events ADD COLUMN isProposal INTEGER DEFAULT 0`);
    } catch (e) { }
    try {
      await run(`ALTER TABLE events ADD COLUMN extras TEXT`);
    } catch (e) { }
    try {
      await run(`ALTER TABLE transactions ADD COLUMN client TEXT`);
    } catch (e) { }
    try {
      await run(`ALTER TABLE transactions ADD COLUMN method TEXT`);
    } catch (e) { }
    try {
      await run(`ALTER TABLE checklists ADD COLUMN items TEXT`);
    } catch (e) { }

    await run(`CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      price REAL,
      type TEXT,
      description TEXT
    )`);

    await run(`CREATE TABLE IF NOT EXISTS event_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER,
      service_id INTEGER,
      quantity INTEGER,
      final_price REAL,
      FOREIGN KEY (event_id) REFERENCES events (id),
      FOREIGN KEY (service_id) REFERENCES services (id)
    )`);

    await run(`CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      rating REAL,
      phone TEXT,
      email TEXT,
      website TEXT,
      status TEXT,
      services TEXT
    )`);

    await run(`CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      quantity INTEGER,
      status TEXT,
      location TEXT
    )`);

    await run(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT,
      amount REAL,
      date TEXT,
      category TEXT,
      type TEXT,
      status TEXT,
      client TEXT,
      method TEXT,
      event_id INTEGER,
      FOREIGN KEY (event_id) REFERENCES events (id)
    )`);

    await run(`CREATE TABLE IF NOT EXISTS contracts (
      id TEXT PRIMARY KEY,
      client TEXT,
      type TEXT,
      date TEXT,
      total REAL,
      status TEXT
    )`);

    await run(`CREATE TABLE IF NOT EXISTS checklists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      date TEXT,
      total INTEGER,
      completed INTEGER,
      priority TEXT,
      items TEXT
    )`);
    console.log('Tabelas inicializadas com sucesso.');
  } catch (err) {
    console.error('Erro ao inicializar tabelas:', err);
  }
}

module.exports = { db, run, all, initializeDatabase };
