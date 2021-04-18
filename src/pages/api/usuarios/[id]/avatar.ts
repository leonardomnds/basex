import { NextApiRequest, NextApiResponse } from "next";
import cors from "../../../../util/Cors";
import prisma from '../../../../prisma/PrismaInstance';
import fs from 'fs';

export default async function Login(req: NextApiRequest, res: NextApiResponse) {

  const id = req.query.id.toString();
  const filePath = `./public/arquivos/Avatar-${id}.jpeg`;

  try {

    await cors(req, res);

    if (req.method === 'GET') {

      const usuario = await prisma.usuario.findUnique({
        select: {
          avatar: true,
        },
        where: {
          id
        }
      })

      if (usuario && usuario?.avatar) {
        fs.writeFile(filePath, usuario.avatar, async (writeErr) => {
          if (writeErr) throw new Error(writeErr.message);
          fs.readFile(filePath, async (readErr, file) => {
            if (readErr) throw new Error(readErr.message);
            fs.unlink(filePath, () => {})
            res.setHeader('Content-disposition', 'attachment; filename='+filePath.slice(filePath.lastIndexOf('/')+1));
            res.setHeader('Content-Type', 'image/jpeg');
            res.status(200).send(file);
            return;
          });
        });
      } else {
        res.status(403).json({ error: 'Usuário não possui avatar configurado!'});
        return;
      }

    } else {
      res.status(405).json({error: 'Método não suportado!'});
      return;
    }
  } catch (err) {
    fs.unlink(filePath, () => {});
    res.status(500).json({error: err.message});
  }
}