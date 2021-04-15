import { Pessoa } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../prisma/PrismaInstance';
import { getPessoaJsonReturn, salvarPessoa } from '../';
import cors from '../../../../util/Cors';

export default async function Grupo(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    const id = req.query.id.toString();
    
    switch (req.method) {
      case 'GET':
        const getPes = await getPessoa(id);
        res.status(200).json(getPes);
        return;

      case 'PUT':
        const pessoaSalvar : Pessoa = req.body;
        pessoaSalvar.id = id;

        const retPost = await salvarPessoa(pessoaSalvar);

        res.status(200).json(retPost.pessoa);
        return;

      case 'DELETE':
        const json = await deletarPessoa(id);
        res.status(202).json(json);
        return;

      default:
        res.status(405).json({error: 'Método não suportado!'});
    }

  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

const deletarPessoa = async (id: string) => {
  const elimina = await prisma.pessoa.delete({
    where: {
      id
    }
  })
  return Boolean(elimina);
}

const getPessoa = async (id: string) => {
  const pessoa = await prisma.pessoa.findUnique({
    where: {
      id
    },
    select: getPessoaJsonReturn()
  })

  return pessoa;
}