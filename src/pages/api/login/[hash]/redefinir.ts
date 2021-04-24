import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import prisma from '../../../../prisma/PrismaInstance';
import cors from '../../../../util/Cors';

export default async function RedefinirSenha(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    const hash = req.query.hash.toString();

    switch (req.method) {
      case 'GET':
        
        const user = await getUserByHash(hash);

        if (!user) {
          res.status(404).json({ error: 'URL Inválida!' });
          return;
        } else if (!user.expiracao_url_senha || new Date() > user.expiracao_url_senha) {
          res.status(401).json({ error: 'Sua URL expirou!' });
          return;
        }

        res.status(200).json({ message: 'URL válida!' });
        return;

      case 'POST':

        const data = await getUserByHash(hash);

        if (!data) {
          res.status(404).json({ error: 'URL Inválida!' });
          return;
        } else if (!data.expiracao_url_senha || new Date() > data.expiracao_url_senha) {
          res.status(401).json({ error: 'Sua URL expirou!' });
          return;
        }

        const { senha } = req.body;

        if (data.pessoa) {
          await prisma.pessoa.update({
            data: {
              senha_acesso: bcrypt.hashSync(senha, 10),
              url_senha: null,
              expiracao_url_senha: null,
            },
            where: {
              id: data.id
            }
          });
        } else {
          await prisma.usuario.update({
            data: {
              senha: bcrypt.hashSync(senha, 10),
              url_senha: null,
              expiracao_url_senha: null,
            },
            where: {
              id: data.id
            }
          });
        }        
      
        res.status(200).json({ message: 'Senha alterada com sucesso!' });
        return;
    
      default:
        res.status(405).json({error: 'Método não suportado!'});
        return;
    }

  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

const getUserByHash = async (hash: string) => {
  let user;

  user = await prisma.pessoa.findFirst({
    select: {
      id: true,
      expiracao_url_senha: true,
    },
    where: {
      url_senha: hash
    }
  });

  if (!user) {
    user = await prisma.usuario.findFirst({
      select: {
        id: true,
        expiracao_url_senha: true,
      },
      where: {
        url_senha: hash
      }
    });
  } else {
    user.pessoa = true;
  }

  if (user && !user.pessoa) {
    user.pessoa = false;
  }

  return user;
}