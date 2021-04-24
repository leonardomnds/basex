import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../prisma/PrismaInstance';
import cors from '../../../util/Cors';
import bcrypt from 'bcrypt';
import { FormatarCpfCnpj, ValidateAuth } from '../../../util/functions';

export default async function AlterarSenha(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    const usuarioId = ValidateAuth(req, 'user');
    const pessoaId = ValidateAuth(req, 'person');

    if (!usuarioId && !pessoaId) {
      res.status(401).json({error: 'Acesso não autorizado!'});
      return;
    }

    if (req.method === 'PUT') {

      const { senha_atual, nova_senha } = req.body

      if (!senha_atual || !nova_senha) {
        res.status(400).json({error: 'Parâmetros obrigatórios não enviados!'});
        return;
      }

      let json;
      let validPass = false;
      if (pessoaId) {
        json = await prisma.pessoa.findUnique({
          select: {
            senha_acesso: true,
          },
          where: {
            id: pessoaId,
          },
        });

        validPass = bcrypt.compareSync(senha_atual, json.senha_acesso);

      } else {
        json = await prisma.usuario.findUnique({
          select: {
            usuario: true,
            senha: true,
          },
          where: {
            id: usuarioId,
          },
        });

        if (!json || json.usuario.toString().toUpperCase() === 'ADMIN') {
          res.status(401).json({error: 'Não é possível alterar a senha do ADMIN!'});
          return;
        }

        validPass = bcrypt.compareSync(senha_atual, json.senha);
      }

      if (!bcrypt.compareSync(senha_atual, pessoaId ? json.senha_acesso : json.senha)) {
        res.status(401).json({error: 'Senha atual informada inválida!'});
        return;
      } else {

        if (pessoaId) {
          await prisma.pessoa.update({
            data: {
              senha_acesso: bcrypt.hashSync(nova_senha, 10),
            },
            where: {
              id: pessoaId,
            }
          });
        } else {
          await prisma.usuario.update({
            data: {
              senha: bcrypt.hashSync(nova_senha, 10),
            },
            where: {
              id: usuarioId,
            }
          });
        }

      }

      res.status(200).json({ message: 'Senha alterada com sucesso!' });
      return;

    } else {
      res.status(405).json({error: 'Método não suportado!'});
      return;
    }

  } catch (err) {
    res.status(500).json({error: err.message});
  }
}