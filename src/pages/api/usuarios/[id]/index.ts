import { Usuario } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

import prisma from '../../../../prisma/PrismaInstance';
import { getUsuarioJsonReturn, salvarUsuario, salvarAvatarUsuario } from '../';
import cors from '../../../../util/Cors';
import nextConnect from 'next-connect';

import { multerUpload } from "../../../../util/middlewares";
import { ValidateAuth } from '../../../../util/functions';

const Usuarios = nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await cors(req, res);

      const usuarioId = ValidateAuth(req, 'adm');

      if (!usuarioId) {
        res.status(401).json({error: 'Acesso não autorizado!'});
        return;
      }  

      const id = req.query.id.toString();

      const getPes = await getUsuario(id);
      res.status(200).json(getPes);
      return;
    } catch (err) {
      res.status(500).json({error: err.message});
    }
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await cors(req, res);

      const usuarioId = ValidateAuth(req, 'adm');

      if (!usuarioId) {
        res.status(401).json({error: 'Acesso não autorizado!'});
        return;
      }  

      const id = req.query.id.toString();

      const json = await deletarUsuario(id);
      res.status(202).json(json);
      return;
    } catch (err) {
      res.status(500).json({error: err.message});
    }
  })
  .use(multerUpload.single('avatar'))
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
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

      const id = req.query.id.toString();
      
      const usuarioSalvar : Usuario = req.body;
      usuarioSalvar.id = id;
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

      res.status(200).json(retPost.usuario);
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