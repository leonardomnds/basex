import { Configuracao } from '.prisma/client';
import { Base64 } from 'js-base64';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../prisma/PrismaInstance';
import cors from '../../../util/Cors';

import { ValidateAuth  } from "../../../util/functions";

export default async function Configuracoes(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    const usuarioId = ValidateAuth(req, 'adm');

    if (!usuarioId) {
      res.status(401).json({error: 'Acesso não autorizado!'});
      return;
    }  

    if (req.method === 'PUT') {
      const data: Configuracao = req.body;
      delete data.id;
      data.email_senha = Base64.encode(data.email_senha || '');
      const json = await prisma.configuracao.updateMany({ data });
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