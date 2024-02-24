DROP TABLE IF EXISTS user;

CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('1', '2', '3')),
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);


INSERT INTO user (username, password, role, createdAt, updatedAt)
VALUES
  ('john.doe@example.com', 'hashedpassword1', '1', strftime('%s','now'), strftime('%s','now')),
  ('jane.doe@example.com', 'hashedpassword2', '2', strftime('%s','now'), strftime('%s','now')),
  ('jim.smith@example.com', 'hashedpassword3', '3', strftime('%s','now'), strftime('%s','now'));
