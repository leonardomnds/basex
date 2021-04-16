/*
  Warnings:

  - A unique constraint covering the columns `[cpf_cnpj]` on the table `pessoas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `pessoas.cpf_cnpj_unique` ON `pessoas`(`cpf_cnpj`);
