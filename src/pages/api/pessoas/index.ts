import { Pessoa } from '.prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../prisma/PrismaInstance';
import cors from '../../../util/Cors';

import { GetDataFromJwtToken  } from "../../../util/functions";

export default async function Pessoas(req: NextApiRequest, res: NextApiResponse) {
  try {

    await cors(req, res);

    const jwtData = GetDataFromJwtToken(req);

    if (!jwtData || !jwtData.usuarioId) {
      res.status(401).json({error: 'Acesso não autorizado!'});
    }
    
    switch (req.method) {
      case 'POST':
        const pessoaSalvar : Pessoa = req.body;
        pessoaSalvar.usuarioId = jwtData.usuarioId;

        const retPost = await salvarPessoa(pessoaSalvar);

        res.status(201).json(retPost.pessoa);
        return;

      case 'GET':
        const json = await listarPessoas();
        res.status(200).json(json);
        return;

      default:
        res.status(405).json({error: 'Método não suportado!'});
    }

  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

const listarPessoas = async () => {
  const people = await prisma.pessoa.findMany({
    select: {
      id: true,
      codigo: true,
      cpfCnpj: true,
      nome: true,
      fantasia: true,
      logradouro: true,
      numero: true,
      ativo: true,
    },
    orderBy: {
      codigo: 'asc'
    }
  });
  return people;
}

export const salvarPessoa = async (pessoa: Pessoa) => {

  const id = pessoa?.id || null;
  delete pessoa.id;

  let person;

  if (id) {
    delete pessoa.codigo;
    delete pessoa.usuarioId;
    delete pessoa.dataCadastro;

    person = await prisma.pessoa.update({
      data: pessoa,
      select: getPessoaJsonReturn(),
      where: {
        id
      }
    });
  } else {
    pessoa.ativo = true;
    pessoa.dataCadastro = new Date();
    
    const ultimoCodigo = await prisma.pessoa.aggregate({
      max: {
        codigo: true,
      }
    });

    pessoa.codigo = ultimoCodigo.max.codigo + 1;

    person = await prisma.pessoa.create({
      data: pessoa,
      select: getPessoaJsonReturn(),
    });
  }

  return { pessoa: person };

}

export const getPessoaJsonReturn = () => {
  return {
    id: true,
    codigo: true,
    cpfCnpj: true,
    nome: true,
    fantasia: true,
    rgInscEstadual: true,
    inscMunicipal: true,
    telefone: true,
    celular: true,
    email: true,
    cep: true,
    logradouro: true,
    numero: true,
    bairro: true,
    complemento: true,
    cidade: true,
    uf: true,
    ativo: true,
    dataCadastro: true,
    grupo: true,
    categoria: true,
    usuario: {
      select: {
        id: true,
        usuario: true,
        nome: true,
      }
    }
  }
}