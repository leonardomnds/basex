-- CreateTable
CREATE TABLE "ContatosPessoas" (
    "id" VARCHAR(100) NOT NULL,
    "pessoaId" VARCHAR(100) NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" VARCHAR(100) NOT NULL,
    "telefone" VARCHAR(20),
    "email" VARCHAR(255),
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContatosPessoas" ADD FOREIGN KEY ("pessoaId") REFERENCES "Pessoas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
