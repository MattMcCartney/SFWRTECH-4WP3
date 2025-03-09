// file to initialize the sqlite database
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./characters.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});

// create table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS characters (
	CharacterId INTEGER PRIMARY KEY AUTOINCREMENT,
    CharacterName TEXT,
    Token BLOB,
    Class TEXT,
    Strength INTEGER,
    Dexterity INTEGER,
    Constitution INTEGER,
    Wisdom INTEGER,
    Intelligence INTEGER,
    Charisma INTEGER,
    Level INTEGER
  )`);
});

module.exports = db;
