-- AlterTable
ALTER TABLE "InstrumentosPessoas" ADD COLUMN     "tempoCalibracao" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "InstrumentosCalibracoes" (
    "id" VARCHAR(100) NOT NULL,
    "instrumentoId" VARCHAR(100) NOT NULL,
    "dataCalibracao" DATE NOT NULL,
    "numeroCertificado" VARCHAR(100) NOT NULL,
    "arquivoCertificado" BYTEA,
    "laboratorio" VARCHAR(100),
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InstrumentosCalibracoes" ADD FOREIGN KEY ("instrumentoId") REFERENCES "InstrumentosPessoas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
