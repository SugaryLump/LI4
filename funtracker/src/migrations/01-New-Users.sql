-- Migration que cria a tabela de utilizadores

CREATE TABLE utilizadores (
  id INT UNIQUE PRIMARY KEY NOT NULL,
  username VARCHAR(45) UNIQUE NOT NULL,
  password_hash VARCHAR(60) NOT NULL
);

CREATE UNIQUE INDEX username_index ON utilizadores(username);
