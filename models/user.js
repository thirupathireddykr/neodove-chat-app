const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const db = new sqlite3.Database('./database.db');

// Initialize database
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, email TEXT)");
});

const registerUser = (username, password, email, callback) => {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return callback(err);
    db.run("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", [username, hash, email], callback);
  });
};

const authenticateUser = (username, password, callback) => {
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, false);
    bcrypt.compare(password, row.password, (err, res) => {
      if (res) {
        callback(null, row);
      } else {
        callback(null, false);
      }
    });
  });
};

module.exports = { registerUser, authenticateUser };
