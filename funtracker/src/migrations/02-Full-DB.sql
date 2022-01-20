ALTER TABLE utilizadores ADD is_admin BOOLEAN;

CREATE TABLE estabelecimentos (
  id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT NOT NULL,
  lotacao INTEGER,
  morada VARCHAR(100),
  coordenadas VARCHAR(50),
  precos INTEGER,
  categoria INTEGER, -- ????
  -- TODO: Horário abertura e fecho
  contacto CHAR(9)
);

CREATE TABLE avaliacoes (
  id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT NOT NULL,
  valor INTEGER,
  comentarios VARCHAR(1024),
  FOREIGN KEY(estabelecimento_id) REFERENCES estabelecimentos(id),
  FOREIGN KEY(user_id) REFERENCES utilizadores(id)
);
