import { Usuario } from '.prisma/client';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../prisma/PrismaInstance';

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  try {
    
    switch (req.method) {
      case 'POST':
        const usuarioSalvar : Usuario = req.body;
        const retPost = await salvarUsuario(usuarioSalvar);

        if (retPost.error) {
          res.status(retPost.code).json({error: retPost.error});
          return;
        }

        res.status(201).json(retPost.usuario);
        return;

      case 'GET':
        const json = await listarUsuarios();
        res.status(200).json(json);
        return;

      default:
        res.status(405).json({error: 'Método não suportado!'});
    }

  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

const listarUsuarios = async () => {
  const users = await prisma.usuario.findMany({
    select: {
      id: true,
      nome: true,
      usuario: true,
      ativo: true,
      dataCadastro: true
    }
  });
  return users;
}

const salvarUsuario = async (usuario: Usuario) => {

  const existe = await prisma.usuario.findUnique({
    where: {
      usuario: usuario.usuario
    },
    select: {
      id: true
    }
  });

  if (existe && existe.id !== usuario.id) {
    return { code: 422, error: 'Usuário já cadastrado!'};
  }

  if (!usuario.id) {
    usuario.ativo = true;
    usuario.dataCadastro = new Date();
    usuario.senha = bcrypt.hashSync(usuario.senha, 10);
  }

  const user = await prisma.usuario.create({
    data: usuario,
    select: {
      id: true,
      nome: true,
      usuario: true,
    }
  });

  return { usuario: user };

}