import { ValidationError } from 'apollo-server-errors';
import Pessoa from '../models/Pessoa';
import ContatoPessoa from '../models/ContatoPessoa';
import validateAuth from '../config/validateAuth';
import Functions from '../../util/ApiFunctions';

module.exports = {
  selectAll(_, args, { user }) {
    validateAuth(user);
    return Pessoa.findAll({
      where: { empresaId: user.empresaId },
      order: ['codigo'],
    });
  },
  async selectOne(_, { id }, { user }) {
    validateAuth(user);
    let retorno = null;

    const pessoa = await Pessoa.findOne({
      where: { id, empresaId: user.empresaId },
    });

    const contatos = await ContatoPessoa.findAll({
      where: { pessoaId: id },
    });

    retorno = pessoa.dataValues;
    retorno.contatos = [];

    contatos.forEach((contato) => {
      retorno.contatos.push(contato.dataValues);
    });

    return retorno;
  },
  async save(
    _,
    {
      id,
      cpfCnpj,
      nome,
      fantasia,
      rgInscEstadual,
      inscMunicipal,
      telefone,
      celular,
      email,
      cep,
      logradouro,
      numeroLogradouro,
      bairro,
      complementoLogradouro,
      cidade,
      uf,
      grupoId,
      categoriaId,
      ativo,
      contatos,
    },
    { user },
  ) {
    validateAuth(user);
    const transaction = await Functions.GetTransaction();

    if (cpfCnpj.length !== 18 && cpfCnpj.length !== 14) {
      throw new ValidationError(
        "O parametro 'cpfCnpj' deve ter 14 ou 18 caracteres.",
      );
    }

    let json;

    if (id) {
      // Editando
      await Pessoa.update(
        {
          cpfCnpj,
          nome,
          fantasia,
          rgInscEstadual,
          inscMunicipal,
          telefone,
          celular,
          email,
          cep,
          logradouro,
          numeroLogradouro,
          bairro,
          complementoLogradouro,
          cidade,
          uf,
          grupoId,
          categoriaId,
          ativo,
        },
        {
          where: { id, empresaId: user.empresaId },
          transaction,
        },
      );

      // Eliminando lista de Contatos
      await ContatoPessoa.destroy({ where: { pessoaId: id }, transaction });
    } else {
      const codigo = await Pessoa.max('codigo', {
        where: { empresaId: user.empresaId },
      });

      json = await Pessoa.create(
        {
          codigo: (codigo || 0) + 1,
          cpfCnpj,
          nome,
          fantasia,
          rgInscEstadual,
          inscMunicipal,
          telefone,
          celular,
          email,
          cep,
          logradouro,
          numeroLogradouro,
          bairro,
          complementoLogradouro,
          cidade,
          uf,
          grupoId,
          categoriaId,
          empresaId: user.empresaId,
          ativo: true,
        },
        {
          transaction,
        },
      );
    }

    // Inserindo lista de contatos enviada
    if (contatos) {
      const promiseContatos = contatos.map(async (con) => {
        const conNome = con.nome;
        const conDescricao = con.descricao;
        const conTelefone = con.telefone;
        const conCelular = con.celular;
        const conEmail = con.email;

        await ContatoPessoa.create(
          {
            pessoaId: id || json.dataValues.id,
            nome: conNome,
            descricao: conDescricao,
            telefone: conTelefone,
            celular: conCelular,
            email: conEmail,
          },
          { transaction },
        );
      });

      await Promise.all(promiseContatos);
    }

    await transaction.commit();
    return Pessoa.findByPk(id || json.dataValues.id);
  },
};
