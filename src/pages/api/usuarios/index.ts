import { Usuario } from '.prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import nextConnect from 'next-connect';
import { multerUpload } from "../../../util/middlewares";

import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../prisma/PrismaInstance';
import cors from '../../../util/Cors';
import { ValidateAuth } from '../../../util/functions';

const Usuarios = nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await cors(req, res);

      const usuarioId = ValidateAuth(req, 'adm');

      if (!usuarioId) {
        res.status(401).json({error: 'Acesso não autorizado!'});
        return;
      }  

      const json = await listarUsuarios();
      res.status(200).json(json);
      return;
    } catch (err) {
      res.status(500).json({error: err.message});
    }
  })
  .use(multerUpload.single('avatar'))
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await cors(req, res);

      const usuarioId = ValidateAuth(req, 'adm');

      if (!usuarioId) {
        if (req['file'] && req['file'].path) {        
          fs.unlink(req['file'].path, () => {});
        }
        res.status(401).json({error: 'Acesso não autorizado!'});
        return;
      }

      const usuarioSalvar : Usuario = req.body;

      const retPost = await salvarUsuario(usuarioSalvar);
      if (req['file'] && req['file']?.path && retPost?.usuario?.id) {
        fs.readFile(req['file'].path, async (fsErr, data) => {
          if (!fsErr) await salvarAvatarUsuario(retPost.usuario.id, data);
          fs.unlink(req['file'].path, () => {});
        });
      }

      if (retPost.error) {
        res.status(retPost.code).json({error: retPost.error});
        return;
      }

      res.status(201).json(retPost.usuario);
      return;
    } catch (err) {
      res.status(500).json({error: err.message});
    }
  })
  .all((req: NextApiRequest, res: NextApiResponse) => {
    if (req['file'] && req['file'].path) {        
      fs.unlink(req['file'].path, () => {});
    }
    res.status(405).json({error: 'Método não suportado!'});
  })

export default Usuarios;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

const listarUsuarios = async () => {
  const users = await prisma.usuario.findMany({
    select: getUsuarioJsonReturn(),
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

  usuario.usuario = usuario.usuario?.toUpperCase();
  usuario.ativo = Boolean(usuario.ativo);
  usuario.administrador = Boolean(usuario.administrador);
  usuario.avatar = null; // Necessário chamar o método 'salvarAvatarUsuario'
  usuario.expiracao_url_senha = null;
  usuario.url_senha = null;

  const existe = await prisma.usuario.findUnique({
    where: {
      usuario: usuario.usuario
    },
    select: {
      id: true
    }
  });

  if ((existe && existe.id !== id) || usuario.usuario === 'ADMIN') {
    return { code: 422, error: usuario.usuario === 'ADMIN' ? 'Esse usuário não pode ser alterado!' : 'Usuário já cadastrado!'};
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

export const salvarAvatarUsuario = async (usuarioId: string, avatar: Buffer) => {
  await prisma.usuario.update({
    data: {
      avatar
    },
    where: {
      id: usuarioId
    }
  });
}

export const getUsuarioJsonReturn = () => {
  return {
    id: true,
    usuario: true,
    nome: true,
    email: true,
    ativo: true,
    administrador: true,
    data_cadastro: true,
  }
}