import { Usuario } from '.prisma/client';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../prisma/PrismaInstance';
import cors from '../../../util/Cors';

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);
    
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
      data_cadastro: true
    },
    where: {
      usuario: {
        not: 'admin'
      }
    }
  });
  return users;
}

export const salvarUsuario = async (usuario: Usuario) => {

  const id = usuario?.id || null;
  delete usuario.id;

  const existe = await prisma.usuario.findUnique({
    where: {
      usuario: usuario.usuario
    },
    select: {
      id: true
    }
  });

  if ((existe && existe.id !== id) || usuario.usuario === 'admin') {
    return { code: 422, error: usuario.usuario === 'admin' ? 'Esse usuário não pode ser alterado!' : 'Usuário já cadastrado!'};
  }

  if (usuario?.senha === '****') {
    delete usuario.senha;
  }

  if (usuario.senha) {
    usuario.senha = bcrypt.hashSync(usuario.senha, 10);
  }

  let user;

  if (id) {
    delete usuario.data_cadastro;

    user = await prisma.usuario.update({
      data: usuario,
      select: getUsuarioJsonReturn(),
      where: {
        id
      }
    });
  } else {
    usuario.ativo = true;
    usuario.data_cadastro = new Date();

    user = await prisma.usuario.create({
      data: usuario,
      select: {
        id: true,
        nome: true,
        usuario: true,
      }
    });
  }

  return { usuario: user };

}

export const getUsuarioJsonReturn = () => {
  return {
    id: true,
    usuario: true,
    nome: true,
    ativo: true,
    data_cadastro: true,
  }
}