import { CategoriaPessoa } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../prisma/PrismaInstance';
import { salvarCategoria } from '.';

export default async function Categoria(req: NextApiRequest, res: NextApiResponse) {
  try {

    const id = req.query.id.toString();
    
    switch (req.method) {
      case 'PUT':
        const categoriaSalvar : CategoriaPessoa = req.body;
        categoriaSalvar.id = id;

        const retPost = await salvarCategoria(categoriaSalvar);

        res.status(200).json(retPost.categoria);
        return;

      case 'DELETE':
        const json = await deletarCategoria(id);
        res.status(202).json(json);
        return;

      default:
        res.status(405).json({error: 'Método não suportado!'});
    }

  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

const deletarCategoria = async (id: string) => {
  const elimina = await prisma.categoriaPessoa.delete({
    where: {
      id
    }
  })
  return Boolean(elimina);
}