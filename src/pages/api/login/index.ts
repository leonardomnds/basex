import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../prisma/PrismaInstance';
import cors from '../../../util/Cors';
import { FormatarCpfCnpj } from '../../../util/functions';

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    const loginPessoa = Boolean(req.query?.pessoa === 'true');
    
    switch (req.method) {
      case 'POST':
        const { usuario, senha } = req.body;
        let json;

        if (loginPessoa) {
          json = await efetuarLoginPessoa(usuario, senha);
        } else {
          json = await efetuarLogin(usuario, senha);
        }

        if (json) {
          res.status(200).json(json);
        } else {
          res.status(401).json({error: 'Usuário e/ou senha inválidos!'});
        }

        return;    
      default:
        res.status(405).json({error: 'Método não suportado!'});
        return;
    }

  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

const efetuarLogin = async (usuario: string, senha: string) => {
  await criarUsuarioAdmin();

  const user = await prisma.usuario.findFirst({
    where: {
      usuario,
      ativo: true
    },
    select: {
      id: true,
      nome: true,
      usuario: true,
      senha: true,
    }
  });

  if (user) {
    const validPass = bcrypt.compareSync(senha, user.senha);

    if (validPass) {
      const token = await jwt.sign(
        {
          usuarioId: user.id,
          pessoaId: null
        },
        process.env.JWT_KEY,
        {
          expiresIn: '6h'
        },
      );

      delete user.senha;

      return {
        usuario: user,
        token,
      }
    }
  }
  return null;
}

const efetuarLoginPessoa = async (usuario: string, senha: string) => {
  await criarUsuarioAdmin();

  usuario = FormatarCpfCnpj(usuario);

  const people = await prisma.pessoa.findFirst({
    where: {
      cpfCnpj: usuario,
      ativo: true
    },
    select: {
      id: true,
      codigo: true,
      cpfCnpj: true,
      nome: true,
      fantasia: true,
    }
  });

  if (people) {
    const validPass = senha === '123456'; // bcrypt.compareSync(senha, user.senha);

    if (validPass) {
      const token = await jwt.sign(
        {
          usuarioId: null,
          pessoaId: people.id
        },
        process.env.JWT_KEY,
        {
          expiresIn: '6h'
        },
      );

      // delete people.senha;

      return {
        usuario: people,
        token,
      }
    }
  }
  return null;
}

const criarUsuarioAdmin = async () => {
  const qtde = await prisma.usuario.count({
    where: {
      usuario: 'admin'
    }
  });

  if (qtde === 0) {
    await prisma.usuario.create({
      data: {
        nome: 'Administrador',
        usuario: 'admin',
        senha: '$2b$10$K.8mjdRixKhxQy1XcjTol.x7W5mXjcdKy9ehZIsdxKORcr5Sw4Sqi'
      }
    });
  }

  return false;
}