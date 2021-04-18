import { format } from 'date-fns';
import { Base64 } from 'js-base64';
import fs from "fs";
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../prisma/PrismaInstance';
import { NomeRelatorio } from '../../../reports/nomesRelatorios';
import ConsultasComuns from '../../../util/ConsultasComuns';
import cors from '../../../util/Cors';
import { JsonToCSV, ValidateAuth } from '../../../util/functions';

export default async function CamposExportar(req: NextApiRequest, res: NextApiResponse) {
  
  const filePath = `./public/arquivos/Relatorio-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.csv`;

  try {

    await cors(req, res);

    if (req.method === 'POST') {

      const usuarioId = ValidateAuth(req, 'user');
      const pessoaId = ValidateAuth(req, 'person');
      const relatorio = parseInt((req.query?.ref?.toString() || '-1'), 10);
  
      if ((!usuarioId && !pessoaId) || (pessoaId && relatorio === NomeRelatorio.listaClientes)) {
        res.status(401).json({error: 'Acesso não autorizado!'});
        return;
      }

      let where = req.query?.filter as string;
      where = where.split(' ').join('+');
      where = `${(where || '').toString().length === 0 ? '1=1' : Base64.atob(decodeURI(where))}`;

      let sqlColunas = '';
      (req.body || []).map((item, index) => {
        if (index !== 0) sqlColunas += ', ';

        if (item.tabela === 'instrumentos' && (item.coluna === 'ultima_calibracao' || item.coluna === 'vencimento_calibracao')) {
          sqlColunas += `view_instrumentos.${item.coluna} as "${item.tabela}.${item.coluna}"`;
        } else {
          sqlColunas += `${item.tabela}.${item.coluna} as "${item.tabela}.${item.coluna}"`;
        }
      });

      let dados = [];
      if (relatorio === NomeRelatorio.listaClientes && !pessoaId) {
        dados = await prisma.$queryRaw(`
        select
          ${sqlColunas}
        from
          pessoas as clientes
          left join grupos_pessoa as grupos_cliente on (clientes.grupo_id = grupos_cliente.id)
          left join categorias_pessoa as categorias_cliente on (clientes.categoria_id = categorias_cliente.id)
        where ${where}
        order by
          clientes.id
        `);
      } else if (relatorio === NomeRelatorio.listaInstrumentos) {
        dados = await prisma.$queryRaw(`
        select
          ${sqlColunas}
        from 
          instrumentos
          inner join pessoas as clientes on (instrumentos.pessoa_id = clientes.id)
          left join grupos_pessoa as grupos_cliente on (clientes.grupo_id = grupos_cliente.id)
          left join categorias_pessoa as categorias_cliente on (clientes.categoria_id = categorias_cliente.id)
          inner join (${ConsultasComuns.vencimentosCalibracoes()}) as view_instrumentos on (instrumentos.id = view_instrumentos.id)
        where ${where}
        order by
          clientes.codigo,
          instrumentos.descricao
        `);
      } else if (relatorio === NomeRelatorio.listaCalibracoes) {
        dados = await prisma.$queryRaw(`
        select
          ${sqlColunas}
        from
          instrumentos_calibracoes as calibracoes
          inner join instrumentos on (instrumentos.id = calibracoes.instrumento_id)
          inner join pessoas as clientes on (instrumentos.pessoa_id = clientes.id)
          left join grupos_pessoa as grupos_cliente on (clientes.grupo_id = grupos_cliente.id)
          left join categorias_pessoa as categorias_cliente on (clientes.categoria_id = categorias_cliente.id)
          inner join (${ConsultasComuns.vencimentosCalibracoes()}) as view_instrumentos on (instrumentos.id = view_instrumentos.id)
        where ${where}
        order by
          calibracoes.data_calibracao,
          instrumentos.descricao
        `);
      }

      if (dados.length === 0) {
        res.status(403).json({ error: 'Não há dados a exportar!'});
        return;
      } else {
        const csvString = await JsonToCSV(dados);

        fs.writeFile(filePath, csvString, async (writeErr) => {
          if (writeErr) throw new Error(writeErr.message);
          fs.readFile(filePath, async (readErr, file) => {
            if (readErr) throw new Error(readErr.message);
            fs.unlink(filePath, () => {})
            res.setHeader('Content-disposition', 'attachment; filename='+filePath.slice(filePath.lastIndexOf('/')+1));
            res.setHeader('Content-Type', 'text/csv');
            res.status(200).send(file);
            return;
          });
        });
      }
    } else {
      res.status(405).json({error: 'Método não suportado!'});
      return;
    }
  
  } catch (err) {
    fs.unlink(filePath, () => {});
    res.status(500).json({error: err.message});
  }
}