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
/*
      const selectCalibracoesVencidas = (dateDiff: string, alias: string) => {
        return `(select count(1) from (select i."id" from "InstrumentosPessoas" as i
          left join "InstrumentosCalibracoes" as c on (i."id" = c."instrumentoId")
          where ${pessoaId ? `i."pessoaId" = '${pessoaId}'` : '1=1'} and i."ativo" = true
          group by i."id", "tempoCalibracao" having coalesce(date_part('day', (MAX(c."dataCalibracao")
          + (i."tempoCalibracao" * interval '1 month')) - MAX(c."dataCalibracao")),-1) ${dateDiff}) as T) as "${alias}"`;
      }
*/
      let sqlResult;
      const json: IndicadoresType = {};

      // Quantidade de Clientes Ativos
      sqlResult = await prisma.$queryRaw(`select count(1) qtde from pessoas where ativo = 1 and ${pessoaId ? `id = '${pessoaId}'` : '1=1'}`);
      json.clientes_ativos = sqlResult[0].qtde;

      // Quantidade de Instrumentos Ativos
      sqlResult = await prisma.$queryRaw(`select count(1) qtde from instrumentos where ativo = 1 and ${pessoaId ? `pessoa_id = '${pessoaId}'` : '1=1'}`);
      json.instrumentos_ativos = sqlResult[0].qtde;
/*

      const sql = `
        select
            (select count(1) from "Pessoas" where ativo = true and ${pessoaId ? `id = '${pessoaId}'` : '1=1'}) as "clientesAtivos",
            (select count(1) from "InstrumentosPessoas" where ativo = true and ${pessoaId ? `"pessoaId" = '${pessoaId}'` : '1=1'}) as "instrumentosAtivos",
            ${selectCalibracoesVencidas('< 0', 'calibracoesVencidas')},
            ${selectCalibracoesVencidas('between 0 and 7', 'calibracoesVencer7')},
            ${selectCalibracoesVencidas('between 0 and 15', 'calibracoesVencer15')},
            ${selectCalibracoesVencidas('between 0 and 30', 'calibracoesVencer30')}
      `;
*/

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