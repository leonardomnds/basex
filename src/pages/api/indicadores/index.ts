import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../prisma/PrismaInstance';
import cors from '../../../util/Cors';
import { ValidateAuth } from '../../../util/functions';

export type IndicadoresType = {
  clientes_ativos?: number,
  instrumentos_ativos?: number,
  calibracoes_vencidas?: number,
  calibracoes_vencer_7?: number,
  calibracoes_vencer_15?: number,
  calibracoes_vencer_30?: number,
}

export default async function Indicadores(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    const usuarioId = ValidateAuth(req, 'user');
    const pessoaId = ValidateAuth(req, 'person');

    if (!usuarioId && !pessoaId) {
      res.status(401).json({error: 'Acesso não autorizado!'});
      return;
    }

    if (req.method === 'GET') {

      let sqlResult;
      const json: IndicadoresType = {};

      // Quantidade de Clientes Ativos
      sqlResult = await prisma.$queryRaw(`select count(1) qtde from pessoas 
        where ativo = 1 and ${pessoaId ? `id = '${pessoaId}'` : '1=1'}`);
      json.clientes_ativos = sqlResult[0].qtde;

      // Quantidade de Instrumentos Ativos
      sqlResult = await prisma.$queryRaw(`select count(1) qtde from instrumentos 
        where ativo = 1 and ${pessoaId ? `pessoa_id = '${pessoaId}'` : '1=1'}`);
      json.instrumentos_ativos = sqlResult[0].qtde;

      // Quantidade de Calibrações Vencidas
      sqlResult = await prisma.$queryRaw(`select count(1) qtde from view_vencimentos_calibracoes 
        where ativo = 1 and dias_vencer < 0 and ${pessoaId ? `pessoa_id = '${pessoaId}'` : '1=1'}`);
      json.calibracoes_vencidas = sqlResult[0].qtde;

      // Quantidade de Calibrações a Vencer em 7 dias
      sqlResult = await prisma.$queryRaw(`select count(1) qtde from view_vencimentos_calibracoes 
        where ativo = 1 and dias_vencer between 0 and 7 and ${pessoaId ? `pessoa_id = '${pessoaId}'` : '1=1'}`);
      json.calibracoes_vencer_7 = sqlResult[0].qtde;

      // Quantidade de Calibrações a Vencer em 15 dias
      sqlResult = await prisma.$queryRaw(`select count(1) qtde from view_vencimentos_calibracoes 
        where ativo = 1 and dias_vencer between 0 and 15 and ${pessoaId ? `pessoa_id = '${pessoaId}'` : '1=1'}`);
      json.calibracoes_vencer_15 = sqlResult[0].qtde;

      // Quantidade de Calibrações a Vencer em 30 dias
      sqlResult = await prisma.$queryRaw(`select count(1) qtde from view_vencimentos_calibracoes 
        where ativo = 1 and dias_vencer between 0 and 30 and ${pessoaId ? `pessoa_id = '${pessoaId}'` : '1=1'}`);
      json.calibracoes_vencer_30 = sqlResult[0].qtde;

      res.status(200).json(json);
      return;
      
    } else {
      res.status(405).json({error: 'Método não suportado!'});
      return;
    }

  } catch (err) {
    console.error(err);
    console.error(err.message);
    res.status(500).json({error: err.message});
  }
}