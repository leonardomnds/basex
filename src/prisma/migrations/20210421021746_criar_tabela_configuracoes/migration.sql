-- AlterTable
ALTER TABLE `pessoas` ADD COLUMN     `email_recuperacao` VARCHAR(255),
    MODIFY `email` VARCHAR(4000);

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN     `email` VARCHAR(100);

-- CreateTable
CREATE TABLE `configuracoes` (
    `id` VARCHAR(100) NOT NULL,
    `email_smtp` VARCHAR(100),
    `email_porta` INTEGER,
    `email_ssl` BOOLEAN NOT NULL DEFAULT false,
    `email_usuario` VARCHAR(100),
    `email_senha` VARCHAR(100),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
