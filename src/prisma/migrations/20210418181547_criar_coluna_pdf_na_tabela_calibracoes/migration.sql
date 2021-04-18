/*
  Warnings:

  - You are about to drop the `contatos_pessoas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `contatos_pessoas` DROP FOREIGN KEY `contatos_pessoas_ibfk_1`;

-- AlterTable
ALTER TABLE `instrumentos_calibracoes` ADD COLUMN     `pdfCertificado` LONGBLOB;

-- DropTable
DROP TABLE `contatos_pessoas`;
