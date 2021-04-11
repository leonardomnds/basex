import { Usuario } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../prisma/PrismaInstance';
import { getUsuarioJsonReturn, salvarUsuario } from '.';
import cors from '../../../util/Cors';

export default async function Grupo(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    const id = req.query.id.toString();
    
    switch (req.method) {
      case 'GET':
        const getPes = await getUsuario(id);
        res.status(200).json(getPes);
        return;

      case 'PUT':
        const usuarioSalvar : Usuario = req.body;
        usuarioSalvar.id = id;

        const retPost = await salvarUsuario(usuarioSalvar);

        if (retPost.error) {
          res.status(retPost.code).json({error: retPost.error});
          return;
        }

        res.status(200).json(retPost.usuario);
        return;

      case 'DELETE':
        const json = await deletarUsuario(id);
        res.status(202).json(json);
        return;

      default:
        res.status(405).json({error: 'Método não suportado!'});
    }

  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

const deletarUsuario = async (id: string) => {
  const elimina = await prisma.usuario.delete({
    where: {
      id
    }
  })
  return Boolean(elimina);
}

const getUsuario = async (id: string) => {
  const usuario = await prisma.usuario.findUnique({
    where: {
      id
    },
    select: getUsuarioJsonReturn(),
  })

  return usuario;
}