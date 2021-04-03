import { ValidationError } from "apollo-server-errors";
import Pessoa from "../models/Pessoa";
import validateAuth from '../../db/config/validateAuth';

module.exports = {
  selectAll(_, args, { user }) {
    validateAuth(user);
    return Pessoa.findAll({
      where: { empresaId: user.empresaId },
      order: ['codigo'],
    });
  },
  selectOne(_, { id }, { user }) {
    validateAuth(user);
    return Pessoa.findOne({
      where: { id, empresaId: user.empresaId },
    });
  },
  async save(_, {
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
    cidadeId,
    grupoId,
    categoriaId,
    ativo
   }, { user }) {
    validateAuth(user);

    if (cpfCnpj.length !== 18 && cpfCnpj.length !== 14) {
      throw new ValidationError("O parametro 'cpfCnpj' deve ter 14 ou 18 caracteres.");
    }

    let json;

    if (id) {
      //Editando
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
          cidadeId,
          grupoId,
          categoriaId,
          ativo: ativo || true
        },
        {
          where: { id, empresaId: user.empresaId },
        },
      );
    } else {
      const codigo = await Pessoa.max('codigo', { where: { empresaId: user.empresaId } });

      json = await Pessoa.create({
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
        cidadeId,
        grupoId,
        categoriaId,
        empresaId: user.empresaId,
        ativo: true
      });
    }    

    return await Pessoa.findByPk(id || json.dataValues.id);
  }
}