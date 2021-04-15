import { GrupoPessoa } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../prisma/PrismaInstance';
import { salvarGrupo } from '.';
import cors from '../../../../util/Cors';

export default async function Grupo(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    const id = req.query.id.toString();
    
    switch (req.method) {
      case 'PUT':
        const grupoSalvar : GrupoPessoa = req.body;
        grupoSalvar.id = id;

        const retPost = await salvarGrupo(grupoSalvar);

        res.status(200).json(retPost.grupo);
        return;

      case 'DELETE':
        const json = await deletarGrupo(id);
        res.status(202).json(json);
        return;

      default:
        res.status(405).json({ error: 'Método não suportado!' });
    }

  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

const deletarGrupo = async (id: string) => {
  const elimina = await prisma.grupoPessoa.delete({
    where: {
      id
    }
  })
  return Boolean(elimina);
}