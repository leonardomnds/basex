-- AlterTable
ALTER TABLE `pessoas` ADD COLUMN     `url_senha` VARCHAR(100),
    ADD COLUMN     `expiracao_url_senha` DATETIME(3);

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN     `administrador` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN     `url_senha` VARCHAR(100),
    ADD COLUMN     `expiracao_url_senha` DATETIME(3);
