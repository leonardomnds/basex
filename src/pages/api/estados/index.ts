import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../../../util/Cors';

export default async function Estados(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    if (req.method === 'GET') {
      res.status(200).json(listarEstados());
    } else {
      res.status(405).json({error: 'Método não suportado!'});
    }
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

const listarEstados = () => {
  return [
    { uf: 'AC', descricao: 'ACRE' },
    { uf: 'AL', descricao: 'ALAGOAS' },
    { uf: 'AM', descricao: 'AMAZONAS' },
    { uf: 'AP', descricao: 'AMAPÁ' },
    { uf: 'BA', descricao: 'BAHIA' },
    { uf: 'CE', descricao: 'CEARÁ' },
    { uf: 'DF', descricao: 'DISTRITO FEDERAL' },
    { uf: 'ES', descricao: 'ESPÍRITO SANTO' },
    { uf: 'GO', descricao: 'GOIÁS' },
    { uf: 'MA', descricao: 'MARANHÃO' },
    { uf: 'MG', descricao: 'MINAS GERAIS' },
    { uf: 'MS', descricao: 'MATO GROSSO DO SUL' },
    { uf: 'MT', descricao: 'MATO GROSSO' },
    { uf: 'PA', descricao: 'PARÁ' },
    { uf: 'PB', descricao: 'PARAÍBA' },
    { uf: 'PE', descricao: 'PERNAMBUCO' },
    { uf: 'PI', descricao: 'PIAUÍ' },
    { uf: 'PR', descricao: 'PARANÁ' },
    { uf: 'RJ', descricao: 'RIO DE JANEIRO' },
    { uf: 'RN', descricao: 'RIO GRANDE DO NORTE' },
    { uf: 'RO', descricao: 'RONDÔNIA' },
    { uf: 'RR', descricao: 'RORAIMA' },
    { uf: 'RS', descricao: 'RIO GRANDE DO SUL' },
    { uf: 'SC', descricao: 'SANTA CATARINA' },
    { uf: 'SE', descricao: 'SERJIPE' },
    { uf: 'SP', descricao: 'SÃO PAULO' },
    { uf: 'TO', descricao: 'TOCANTINS' },
  ];
}