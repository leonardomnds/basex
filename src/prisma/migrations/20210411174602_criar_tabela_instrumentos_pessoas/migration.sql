-- CreateTable
CREATE TABLE "InstrumentosPessoas" (
    "id" VARCHAR(100) NOT NULL,
    "pessoaId" VARCHAR(100) NOT NULL,
    "tag" VARCHAR(100) NOT NULL,
    "descricao" VARCHAR(100) NOT NULL,
    "serie" VARCHAR(100),
    "responsavel" VARCHAR(100),
    "area" VARCHAR(100),
    "subArea" VARCHAR(100),
    "fabricante" VARCHAR(100),
    "modelo" VARCHAR(100),
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstrumentosPessoas.pessoaId_tag_unique" ON "InstrumentosPessoas"("pessoaId", "tag");

-- AddForeignKey
ALTER TABLE "InstrumentosPessoas" ADD FOREIGN KEY ("pessoaId") REFERENCES "Pessoas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
