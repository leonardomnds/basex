/*
  Warnings:

  - You are about to drop the column `usuario_id` on the `pessoas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `pessoas` DROP FOREIGN KEY `pessoas_usuario_id_fkey`;

-- AlterTable
ALTER TABLE `pessoas` DROP COLUMN `usuario_id`;
