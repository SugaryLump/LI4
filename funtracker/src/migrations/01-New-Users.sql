CREATE TABLE utilizadores (
  id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT NOT NULL,
  username VARCHAR(45) UNIQUE NOT NULL,
  password_hash VARCHAR(60) NOT NULL
);

CREATE UNIQUE INDEX username_index ON utilizadores(username);
