-- CreateTable
CREATE TABLE "Usuarios" (
    "id" VARCHAR(100) NOT NULL,
    "usuario" VARCHAR(100) NOT NULL,
    "senha" VARCHAR(100) NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriasPessoa" (
    "id" VARCHAR(100) NOT NULL,
    "descricao" VARCHAR(100) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GruposPessoa" (
    "id" VARCHAR(100) NOT NULL,
    "descricao" VARCHAR(100) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pessoas" (
    "id" VARCHAR(100) NOT NULL,
    "codigo" INTEGER NOT NULL,
    "cpfCnpj" VARCHAR(18) NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "fantasia" VARCHAR(100),
    "rgInscEstadual" VARCHAR(50),
    "inscMunicipal" VARCHAR(50),
    "telefone" VARCHAR(20),
    "celular" VARCHAR(20),
    "email" VARCHAR(255),
    "cep" VARCHAR(9),
    "logradouro" VARCHAR(255),
    "numero" VARCHAR(50),
    "bairro" VARCHAR(255),
    "cidade" VARCHAR(255),
    "uf" VARCHAR(2),
    "grupoId" VARCHAR(100),
    "categoriaId" VARCHAR(100),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" VARCHAR(100) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios.usuario_unique" ON "Usuarios"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriasPessoa.descricao_unique" ON "CategoriasPessoa"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "GruposPessoa.descricao_unique" ON "GruposPessoa"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoas.codigo_unique" ON "Pessoas"("codigo");

-- AddForeignKey
ALTER TABLE "Pessoas" ADD FOREIGN KEY ("grupoId") REFERENCES "GruposPessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pessoas" ADD FOREIGN KEY ("categoriaId") REFERENCES "CategoriasPessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pessoas" ADD FOREIGN KEY ("usuarioId") REFERENCES "Usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;