import { CategoriaPessoa } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../prisma/PrismaInstance';

export default async function Categoria(req: NextApiRequest, res: NextApiResponse) {
  try {
    
    switch (req.method) {
      case 'POST':
        const categoriaSalvar : CategoriaPessoa = req.body;
        const retPost = await salvarCategoria(categoriaSalvar);

        res.status(201).json(retPost.categoria);
        return;

      case 'GET':
        const json = await listarCategorias();
        res.status(200).json(json);
        return;

      default:
        res.status(405).json({error: 'Método não suportado!'});
    }

  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

const listarCategorias = async () => {
  const categorias = await prisma.categoriaPessoa.findMany({
    orderBy: {
      descricao: 'asc'
    }
  });
  return categorias;
}

export const salvarCategoria = async (categoria: CategoriaPessoa) => {

  let json;
  if (!categoria.id) {
    json = await prisma.categoriaPessoa.create({ data: categoria });
  } else {
    json = await prisma.categoriaPessoa.update({
      data: categoria,
      where: {
        id: categoria.id
      }
    });
  }

  return { categoria: json };

}