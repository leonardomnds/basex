import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../prisma/PrismaInstance';
import { NomeRelatorio } from '../../../reports/nomesRelatorios';
import cors from '../../../util/Cors';
import { ValidateAuth } from '../../../util/functions';

export default async function CamposExportar(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    if (req.method === 'GET') {
      const usuarioId = ValidateAuth(req, 'user');
      const pessoaId = ValidateAuth(req, 'person');
      const relatorio = parseInt((req.query?.ref?.toString() || '-1'), 10);
  
      if ((!usuarioId && !pessoaId) || (pessoaId && relatorio === NomeRelatorio.listaClientes)) {
        res.status(401).json({error: 'Acesso não autorizado!'});
        return;
      }

      const getColunasTabela = async (tabela: string, arrayCompletar = []) => {
        const dadosBD = await prisma.$queryRaw(`show columns from ${tabela}`);
        dadosBD.map((d) => arrayCompletar.push({ tabela: tabela.replace('pessoa','cliente').replace('instrumentos_',''), coluna: d.Field }));
        return arrayCompletar;
      }

      let dados = [];
      if (relatorio === NomeRelatorio.listaClientes && !pessoaId) {
        dados = await getColunasTabela('pessoas', dados);
        dados = await getColunasTabela('grupos_pessoa', dados);
        dados = await getColunasTabela('categorias_pessoa', dados);
      } else if (relatorio === NomeRelatorio.listaInstrumentos) {
        dados = await getColunasTabela('instrumentos', dados);
        dados.push({ tabela: 'instrumentos', coluna: 'ultima_calibracao' });
        dados.push({ tabela: 'instrumentos', coluna: 'vencimento_calibracao' });
        if (!pessoaId) dados = await getColunasTabela('pessoas', dados);        
        if (!pessoaId) dados = await getColunasTabela('grupos_pessoa', dados);
        if (!pessoaId) dados = await getColunasTabela('categorias_pessoa', dados);
      } else if (relatorio === NomeRelatorio.listaCalibracoes) {
        dados = await getColunasTabela('instrumentos_calibracoes', dados);
        dados = await getColunasTabela('instrumentos', dados);  
        dados.push({ tabela: 'instrumentos', coluna: 'ultima_calibracao' });
        dados.push({ tabela: 'instrumentos', coluna: 'vencimento_calibracao' });    
        if (!pessoaId) dados = await getColunasTabela('pessoas', dados);        
        if (!pessoaId) dados = await getColunasTabela('grupos_pessoa', dados);
        if (!pessoaId) dados = await getColunasTabela('categorias_pessoa', dados);
      }

      res.status(200).json(removerColunasSensiveis(dados));
      return;
    } else {
      res.status(405).json({error: 'Método não suportado!'});
      return;

    }
  
  } catch (err) {
    if (err.message.includes(`doesn't exist`)) {
      res.status(404).json({error: 'Tabela não existente no banco de dados!'});
      return;
    }
    res.status(500).json({error: err.message});
  }
}

export const removerColunasSensiveis = (dados: any[]) => {
  const camposRetornar = [];
  (dados || []).map((d) => {
    if (
      d.coluna != 'id'
      && !d.coluna.includes('_id')
      && !d.coluna.includes('senha')
      && !d.coluna.includes('avatar')
      && !d.coluna.includes('pdfCert')
    ) {
      camposRetornar.push(d);
    }
  });
  return camposRetornar;
}