import { NextApiRequest, NextApiResponse } from 'next';

import api from "../../../util/ApiSemBase";
import cors from '../../../util/Cors';
import { SomenteNumeros, FormatarCep } from "../../../util/functions";


export default async function CEP(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    if (req.method === 'GET') {
      const cep = req.query.cep.toString();
      const endereco = await consultarCEP(cep);
      
      if (endereco) {
        res.status(200).json(endereco);
      } else {
        res.status(404).json({ error: 'CEP não localizado!'});
      }
      return;
    }
    
    res.status(405).json({error: 'Método não suportado!'});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

export const consultarCEP = async (cep: string) => {
  const cepConsultar = SomenteNumeros(cep);

  if (cepConsultar.length === 8) {
    const response = await api.get(`https://viacep.com.br/ws/${cepConsultar}/json/`);

    if (!response || !response.data || response.data.erro) {
      return null;
    }

    const json = response.data;

    return {
      cep: FormatarCep(cep),
      logradouro: json.logradouro ? json.logradouro.toUpperCase() : null,
      numero: '',
      bairro: json.bairro ? json.bairro.toUpperCase() : null,
      complemento: json.complemento,
      cidade: json.localidade ? json.localidade.toUpperCase() : null,
      uf: json.uf ? json.uf.toUpperCase() : null,
    };
  }

  return null;
}