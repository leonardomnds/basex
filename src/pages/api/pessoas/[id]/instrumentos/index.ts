import { Instrumento } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../../prisma/PrismaInstance';
import cors from '../../../../../util/Cors';
import { ValidateAuth } from '../../../../../util/functions';

export default async function Instrumentos(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    const usuarioId = ValidateAuth(req, 'user');
    const pessoaIdAuth = ValidateAuth(req, 'person');
    const pessoaId = req.query.id.toString();

    if (!usuarioId && pessoaIdAuth !== pessoaId) {
      res.status(401).json({error: 'Acesso não autorizado!'});
      return;
    }

    switch (req.method) {
      case 'POST':
        const instrumentoSalvar : Instrumento = req.body;
        const retPost = await salvarInstrumento(instrumentoSalvar, pessoaId);

        res.status(201).json(retPost.instrumento);
        return;

      case 'GET':
        const json = await listarInstrumentos(pessoaId);
        res.status(200).json(json);
        return;

      default:
        res.status(405).json({error: 'Método não suportado!'});
        return;
    }

  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

const listarInstrumentos = async (pessoaId: string) => {

  const instrumentos = await prisma.$queryRaw(`
    SELECT
      i."id",
      i."tag",
      i."descricao",
      i."ativo",
      MAX(c."dataCalibracao") AS "ultimaCalibracao"
    FROM 
      "InstrumentosPessoas" as i
      LEFT JOIN "InstrumentosCalibracoes" AS c ON (i."id" = c."instrumentoId")
    WHERE
      i."pessoaId" = '${pessoaId}'
    GROUP BY
      i."id",
      i."tag",
      i."descricao",
      i."ativo"
  `);

  return instrumentos;
}

export const salvarInstrumento = async (instrumento: Instrumento, pessoaId: string) => {

  const id = instrumento.id;
  delete instrumento.id;

  let json;
  if (id) { // Update
    delete instrumento.pessoaId;
    delete instrumento.dataCadastro;

    json = await prisma.instrumento.update({
      data: instrumento,
      where: {
        id: id
      },
      select: getInstrumentoJsonReturn(),
    });
  } else {
    instrumento.ativo = true;
    instrumento.pessoaId = pessoaId;
    instrumento.dataCadastro = new Date();

    json = await prisma.instrumento.create({
      data: instrumento,
      select: getInstrumentoJsonReturn(),
    });
  }

  return { instrumento: json };

}

export const getInstrumentoJsonReturn = () => {
  return {
    id: true,
    pessoa: {
      select: {
        id: true,
        codigo: true,
        cpfCnpj: true,
        nome: true,
        fantasia: true,
      }
    },
    tag: true,
    descricao: true,
    tempoCalibracao: true,
    responsavel: true,
    area: true,
    subArea: true,
    fabricante: true,
    modelo: true,
    serie: true,
    observacoes: true,
    ativo: true,
    dataCadastro: true,
  }
}