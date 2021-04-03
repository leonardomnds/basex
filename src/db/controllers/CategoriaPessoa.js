import { ApolloError } from "apollo-server-errors";
const { Op } = require('sequelize');

import Categoria from "../models/CategoriaPessoa";
import Pessoa from "../models/Pessoa";
import validateAuth from '../../db/config/validateAuth';

module.exports = {
  selectAll(_, args, { user }) {
    validateAuth(user);
    return Categoria.findAll({
      where: { empresaId: user.empresaId },
      order: ['descricao'],
    });
  },
  async insert(_, { descricao }, { user }) {
    validateAuth(user);

    if (
      await Categoria.findOne({
        where: {
          descricao,
          empresaId: user.empresaId,
        },
      })
    ) {
      throw new ApolloError("Categoria já existe", "item already exists");
    }

    let json = await Categoria.create({
      descricao,
      empresaId: user.empresaId,
    });

    return Categoria.findByPk(json.dataValues.id);
  },
  async update(_, { id, descricao }, { user }) {
    validateAuth(user);

    if (
      await Categoria.findOne({
        where: {
          descricao,
          empresaId: user.empresaId,
          id: {
            [Op.ne]: id,
          },
        },
      })
    ) {
      throw new ApolloError("Categoria já existe", "item already exists");
    }

    await Categoria.update(
      { descricao },
      {
        where: { id, empresaId: user.empresaId },
      },
    );

    const json = await Categoria.findOne({
      where: { id, empresaId: user.empresaId },
    });

    if (!json) {
      throw new ApolloError("Categoria não existe", "item not found");
    }

    return json;
  },
  async delete(_, { id }, { user }) {
    validateAuth(user);

    if (await Pessoa.findOne({ where: { categoriaId: id } })) {
      throw new ApolloError("Categoria em uso", "item in use");
    }

    await Categoria.destroy({
      where: { id, empresaId },
    });

    return 'Categoria excluída com sucesso';
  }
};