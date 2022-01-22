// Este módulo gere as migrations, ou seja, alterações à base de dados
import { PromisedDatabase } from "promised-sqlite3";

export default async function migrate(db: PromisedDatabase) {
    await db.createTable('utilizadores', true,
        'id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT NOT NULL',
        'username VARCHAR(45) UNIQUE NOT NULL',
        'password_hash VARCHAR(60) NOT NULL',
        'is_admin INTEGER DEFAULT FALSE'
    )

    await db.createTable('estabelecimentos', true,
        'id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT NOT NULL',
        'nome VARCHAR(100)',
        'lotacao INTEGER',
        'morada VARCHAR(100)',
        'coordenadas VARCHAR(50)',
        'precos INTEGER',
        'pontuacao FLOAT',
        'horario_abertura TIME',
        'horario_fecho TIME',
        'contacto CHAR(9)'
    )

    await db.createTable('categorias', true,
        'estabelecimento_id INTEGER NOT NULL',
        'categoria STRING NOT NULL',
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
}
