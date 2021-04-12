import { NextApiRequest, NextApiResponse } from 'next';

import prisma from "../../../../../prisma/PrismaInstance";

import cors from '../../../../../util/Cors';
import { ValidateAuth } from '../../../../../util/functions';
import { getCalibracaoJsonReturn } from "./[instrumentoId]/calibracoes";

export default async function Calibracoes(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    const usuarioId = ValidateAuth(req, 'user');
    const pessoaIdAuth = ValidateAuth(req, 'person');
    const pessoaId = req.query.id.toString();

    if (!usuarioId && pessoaIdAuth !== pessoaId) {
      res.status(401).json({error: 'Acesso não autorizado!'});
      return;
    }

    if (req.method === 'GET') {
      const json = await listarCalibracoes(req.query);
      res.status(200).json(json);
      return;
    } else {
      res.status(405).json({error: 'Método não suportado!'});
      return;
    }

  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

const listarCalibracoes = async (query: { [key: string]: string | string[] }) => {

  let instrumento: any = {
    id: {
      not: '',
    },
    pessoaId: {
      not: ''
    }
  }

  if (query?.pessoaId) {
    instrumento.pessoaId = query?.pessoaId?.toString();
  }
  if (query?.instrumentoId) {
    instrumento.id = query?.instrumentoId?.toString();
  }

  const calibracoes = await prisma.calibracao.findMany({
    where: {
      dataCalibracao: {
        gte: query?.dataCalibracaoInicial ? new Date(query.dataCalibracaoInicial.toString()) : new Date(2000,1,1),
        lte: query?.dataCalibracaoFinal ? new Date(query.dataCalibracaoFinal.toString()) : new Date(2050,1,1),
      },
      instrumento,
    },
    orderBy: {
      dataCalibracao: 'desc',
    },
    select: getCalibracaoJsonReturn(),
  });

  return calibracoes;
}