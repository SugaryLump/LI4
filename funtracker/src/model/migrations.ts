// Este módulo gere as migrations, ou seja, alterações à base de dados
import { PromisedDatabase } from "promised-sqlite3";
import { FunTracker } from "./FunTracker";

export default async function migrate(db: PromisedDatabase) {
    await db.createTable('utilizadores', true,
        'id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT NOT NULL',
        'username VARCHAR(45) UNIQUE NOT NULL',
        'password_hash VARCHAR(60) NOT NULL',
        'is_admin INTEGER DEFAULT FALSE'
    )

    await db.createTable('estabelecimentos', true,
        'id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT NOT NULL',
        'nome VARCHAR(100) NOT NULL',
        'lotacao INTEGER NOT NULL',
        'morada VARCHAR(100) NOT NULL',
        'coordenadas VARCHAR(50) NOT NULL',
        'precos INTEGER NOT NULL',
        'pontuacao FLOAT NOT NULL',
        'horario_abertura TIME NOT NULL',
        'horario_fecho TIME NOT NULL',
        'contacto CHAR(9) NOT NULL'
    )

    await db.createTable('categorias', true,
        'estabelecimento_id INTEGER NOT NULL',
        'categoria VARCHAR(50) NOT NULL',
        'FOREIGN KEY(estabelecimento_id) REFERENCES estabelecimentos(id)',
        'PRIMARY KEY (estabelecimento_id, categoria)'
    )

    await db.createTable('avaliacoes', true,
        'valor INTEGER NOT NULL',
        'comentarios VARCHAR(1024)',
        'estabelecimento_id INTEGER NOT NULL',
        'user_id INTEGER NOT NULL',
        'FOREIGN KEY(estabelecimento_id) REFERENCES estabelecimentos(id)',
        'FOREIGN KEY(user_id) REFERENCES utilizadores(id)',
        'PRIMARY KEY (estabelecimento_id, user_id)'
    )

    await db.createTable('imagens', true,
        'id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT NOT NULL',
        'estabelecimento_id INTEGER NOT NULL',
        'filepath VARCHAR(1024) NOT NULL',
        'FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimentos(id)',
    )

    if ((await db.get("SELECT COUNT(*) FROM utilizadores WHERE is_admin = 1"))['COUNT(*)'] == 0) {
        FunTracker.criarContaAdmin("admin", "admin")
    }
}
