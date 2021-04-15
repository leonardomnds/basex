-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(100) NOT NULL,
    `usuario` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(100) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE INDEX `usuarios.usuario_unique`(`usuario`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias_pessoa` (
    `id` VARCHAR(100) NOT NULL,
    `descricao` VARCHAR(100) NOT NULL,
UNIQUE INDEX `categorias_pessoa.descricao_unique`(`descricao`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupos_pessoa` (
    `id` VARCHAR(100) NOT NULL,
    `descricao` VARCHAR(100) NOT NULL,
UNIQUE INDEX `grupos_pessoa.descricao_unique`(`descricao`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pessoas` (
    `id` VARCHAR(100) NOT NULL,
    `codigo` INTEGER NOT NULL,
    `cpf_cnpj` VARCHAR(18) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `fantasia` VARCHAR(100),
    `rg_insc_estadual` VARCHAR(50),
    `insc_municipal` VARCHAR(50),
    `telefone` VARCHAR(20),
    `celular` VARCHAR(20),
    `email` VARCHAR(255),
    `cep` VARCHAR(9),
    `logradouro` VARCHAR(255),
    `numero` VARCHAR(50),
    `bairro` VARCHAR(255),
    `cidade` VARCHAR(255),
    `uf` VARCHAR(2),
    `complemento` VARCHAR(255),
    `senha_acesso` VARCHAR(100) NOT NULL DEFAULT '',
    `grupo_id` VARCHAR(100),
    `categoria_id` VARCHAR(100),
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuario_id` VARCHAR(100) NOT NULL,
UNIQUE INDEX `pessoas.codigo_unique`(`codigo`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contatos_pessoas` (
    `id` VARCHAR(100) NOT NULL,
    `pessoa_id` VARCHAR(100) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `descricao` VARCHAR(100) NOT NULL,
    `telefone` VARCHAR(20),
    `celular` VARCHAR(20),
    `email` VARCHAR(255),
    `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `instrumentos` (
    `id` VARCHAR(100) NOT NULL,
    `pessoa_id` VARCHAR(100) NOT NULL,
    `tag` VARCHAR(100) NOT NULL,
    `descricao` VARCHAR(100) NOT NULL,
    `tempo_calibracao` INTEGER NOT NULL DEFAULT 0,
    `serie` VARCHAR(100),
    `responsavel` VARCHAR(100),
    `area` VARCHAR(100),
    `subarea` VARCHAR(100),
    `fabricante` VARCHAR(100),
    `modelo` VARCHAR(100),
    `observacoes` TEXT,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
UNIQUE INDEX `instrumentos.pessoa_id_tag_unique`(`pessoa_id`, `tag`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `instrumentos_calibracoes` (
    `id` VARCHAR(100) NOT NULL,
    `instrumento_id` VARCHAR(100) NOT NULL,
    `data_calibracao` DATE NOT NULL,
    `numero_certificado` VARCHAR(100) NOT NULL,
    `laboratorio` VARCHAR(100),
    `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pessoas` ADD FOREIGN KEY (`grupo_id`) REFERENCES `grupos_pessoa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pessoas` ADD FOREIGN KEY (`categoria_id`) REFERENCES `categorias_pessoa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pessoas` ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contatos_pessoas` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `instrumentos` ADD FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `instrumentos_calibracoes` ADD FOREIGN KEY (`instrumento_id`) REFERENCES `instrumentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
