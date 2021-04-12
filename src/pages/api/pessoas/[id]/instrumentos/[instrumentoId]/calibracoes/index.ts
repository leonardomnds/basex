import { Calibracao } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from "../../../../../../../prisma/PrismaInstance";

import cors from '../../../../../../../util/Cors';
import { ValidateAuth } from '../../../../../../../util/functions';

export default async function Calibracoes(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    const usuarioId = ValidateAuth(req, 'user');
    const pessoaIdAuth = ValidateAuth(req, 'person');
    const pessoaId = req.query.id.toString();
    const instrumentoId = req.query.instrumentoId.toString();

    if (!usuarioId && pessoaIdAuth !== pessoaId) {
      res.status(401).json({error: 'Acesso não autorizado!'});
      return;
    }

    switch (req.method) {
      case 'POST':
        const calibracaoSalvar : Calibracao = req.body;
        const retPost = await salvarCalibracao(calibracaoSalvar, instrumentoId);

        res.status(201).json(retPost.calibracao);
        return;

      case 'GET':
        const json = await listarCalibracoes(instrumentoId);
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

const listarCalibracoes = async (instrumentoId: string) => {

  const calibracoes = await prisma.calibracao.findMany({
    where: {
      instrumentoId
    },
    orderBy: {
      dataCalibracao: 'asc',
    },
    select: getCalibracaoJsonReturn(),
  });

  return calibracoes;
}

export const salvarCalibracao = async (calibracao: Calibracao, instrumentoId: string) => {

  const id = calibracao.id;
  delete calibracao.id;

  calibracao.instrumentoId = instrumentoId;

  let json;
  if (id) { // Update
    delete calibracao.dataCadastro;

    json = await prisma.calibracao.update({
      data: calibracao,
      where: {
        id: id
      },
      select: getCalibracaoJsonReturn(),
    });
  } else {
    calibracao.dataCadastro = new Date();

    json = await prisma.calibracao.create({
      data: calibracao,
      select: getCalibracaoJsonReturn(),
    });
  }

  return { calibracao: json };

}

export const getCalibracaoJsonReturn = () => {
  return {
    id: true,
    instrumento: {
      select: {
        id: true,
        tag: true,
        descricao: true,
      }
    },
    dataCalibracao: true,
    numeroCertificado: true,
    laboratorio: true,
  }
}