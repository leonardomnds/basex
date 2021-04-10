import { GrupoPessoa } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../prisma/PrismaInstance';

export default async function Grupo(req: NextApiRequest, res: NextApiResponse) {
  try {
    
    switch (req.method) {
      case 'POST':
        const grupoSalvar : GrupoPessoa = req.body;
        const retPost = await salvarGrupo(grupoSalvar);

        res.status(201).json(retPost.grupo);
        return;

      case 'GET':
        const json = await listarGrupos();
        res.status(200).json(json);
        return;

      default:
        res.status(405).json({error: 'Método não suportado!'});
    }

  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

const listarGrupos = async () => {
  const grupos = await prisma.grupoPessoa.findMany({
    orderBy: {
      descricao: 'asc'
    }
  });
  return grupos;
}

export const salvarGrupo = async (grupo: GrupoPessoa) => {

  let json;
  if (!grupo.id) {
    json = await prisma.grupoPessoa.create({ data: grupo });
  } else {
    json = await prisma.grupoPessoa.update({
      data: grupo,
      where: {
        id: grupo.id
      }
    });
  }

  return { grupo: json };

}