import { NextApiRequest, NextApiResponse } from 'next';

import api from "../../../util/ApiSemBase";
import { SomenteNumeros, FormatarCnpj } from "../../../util/functions";
import { consultarCEP } from '../cep/[cep]';


export default async function CNPJ(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const cnpj = req.query.cnpj.toString();
      const empresa = await consultarCNPJ(cnpj);
      
      if (empresa) {
        res.status(200).json(empresa);
      } else {
        res.status(404).json({ error: 'CNPJ não localizado!'});
      }
      return;
    }
    
    res.status(405).json({error: 'Método não suportado!'});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

export const consultarCNPJ = async (cnpj: string) => {
  const cnpjConsultar = SomenteNumeros(cnpj);

    if (cnpjConsultar.length === 14) {
      const response = await api.get(
        `https://www.receitaws.com.br/v1/cnpj/${cnpjConsultar}`,
      );

      if (!response || !response.data || response.data.status === 'ERROR') {
        return null;
      }

      const json = response.data;

      let endereco;
      if (json.cep) {
        endereco = await consultarCEP(json.cep);
        if (endereco && endereco.logradouro && json.numero) {
          endereco.logradouro = `${json.numero}|${endereco.logradouro}`;
        }
      }

      return {
        cnpj: FormatarCnpj(cnpj),
        razaoSocial: json.nome ? json.nome.toUpperCase() : null,
        fantasia: json.fantasia ? json.fantasia.toUpperCase() : null,
        endereco: endereco || null,
      };
    }
    return null;
}