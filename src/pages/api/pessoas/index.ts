import { Pessoa } from ".prisma/client";
import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../prisma/PrismaInstance";
import cors from "../../../util/Cors";

import { SomenteNumeros, ValidateAuth } from "../../../util/functions";

export default async function Pessoas(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await cors(req, res);

    const usuarioId = ValidateAuth(req, "user");

    if (!usuarioId) {
      res.status(401).json({ error: "Acesso não autorizado!" });
      return;
    }

    switch (req.method) {
      case "POST":
        const pessoaSalvar: Pessoa = req.body;
        pessoaSalvar.usuario_id = usuarioId;

        const retPost = await salvarPessoa(pessoaSalvar);

        if (retPost.error) {
          res.status(retPost.code).json({ error: retPost.error });
          return;
        }

        res.status(201).json(retPost.pessoa);
        return;

      case "GET":
        const json = await listarPessoas();
        res.status(200).json(json);
        return;

      default:
        res.status(405).json({ error: "Método não suportado!" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const listarPessoas = async () => {
  const people = await prisma.pessoa.findMany({
    select: {
      id: true,
      codigo: true,
      cpf_cnpj: true,
      nome: true,
      fantasia: true,
      logradouro: true,
      numero: true,
      ativo: true,
    },
    orderBy: {
      codigo: "asc",
    },
  });
  return people;
};

export const salvarPessoa = async (pessoa: Pessoa) => {
  const id = pessoa?.id || null;
  delete pessoa.id;

  const existe = await prisma.pessoa.findUnique({
    where: {
      cpf_cnpj: pessoa.cpf_cnpj,
    },
    select: {
      id: true,
    },
  });

  if (existe && existe.id !== id) {
    return {
      code: 422,
      error: "Já existe um cliente cadastrado com esse CPF/CNPJ!",
    };
  }

  if (!pessoa?.senha_acesso) {
    pessoa.senha_acesso = SomenteNumeros(pessoa?.cpf_cnpj || "0000").substring(
      0,
      4
    );
  } else if (pessoa?.senha_acesso === "****") {
    delete pessoa.senha_acesso;
  }

  if (pessoa.senha_acesso) {
    pessoa.senha_acesso = bcrypt.hashSync(pessoa.senha_acesso, 10);
  }

  let person;

  if (id) {
    delete pessoa.codigo;
    delete pessoa.usuario_id;
    delete pessoa.data_cadastro;

    person = await prisma.pessoa.update({
      data: pessoa,
      select: getPessoaJsonReturn(),
      where: {
        id,
      },
    });
  } else {
    pessoa.ativo = true;
    pessoa.data_cadastro = new Date();

    const ultimoCodigo = await prisma.pessoa.aggregate({
      _max: {
        codigo: true,
      },
    });

    pessoa.codigo = ultimoCodigo._max.codigo + 1;

    person = await prisma.pessoa.create({
      data: pessoa,
      select: getPessoaJsonReturn(),
    });
  }

  return { pessoa: person };
};

export const getPessoaJsonReturn = () => {
  return {
    id: true,
    codigo: true,
    cpf_cnpj: true,
    nome: true,
    fantasia: true,
    rg_insc_estadual: true,
    insc_municipal: true,
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
    data_cadastro: true,
    grupo: true,
    categoria: true,
    usuario: {
      select: {
        id: true,
        usuario: true,
        nome: true,
      },
    },
  };
};
