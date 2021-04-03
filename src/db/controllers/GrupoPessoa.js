import { ApolloError } from "apollo-server-errors";
const { Op } = require('sequelize');

import Grupo from "../models/GrupoPessoa";
import Pessoa from "../models/Pessoa";
import validateAuth from '../../db/config/validateAuth';

module.exports = {
  selectAll(_, args, { user }) {
    validateAuth(user);
    return Grupo.findAll({
      where: { empresaId: user.empresaId },
      order: ['descricao'],
    });
  },
  async insert(_, { descricao }, { user }) {
    validateAuth(user);

    if (
      await Grupo.findOne({
        where: {
          descricao,
          empresaId: user.empresaId,
        },
      })
    ) {
      throw new ApolloError("Grupo já existe", "item already exists");
    }

    let json = await Grupo.create({
      descricao,
      empresaId: user.empresaId,
    });

    return Grupo.findByPk(json.dataValues.id);
  },
  async update(_, { id, descricao }, { user }) {
    validateAuth(user);

    if (
      await Grupo.findOne({
        where: {
          descricao,
          empresaId: user.empresaId,
          id: {
            [Op.ne]: id,
          },
        },
      })
    ) {
      throw new ApolloError("Grupo já existe", "item already exists");
    }

    await Grupo.update(
      { descricao },
      {
        where: { id, empresaId: user.empresaId },
      },
    );

    const json = await Grupo.findOne({
      where: { id, empresaId: user.empresaId },
    });

    if (!json) {
      throw new ApolloError("Grupo não existe", "item not found");
    }

    return json;
  },
  async delete(_, { id }, { user }) {
    validateAuth(user);

    if (await Pessoa.findOne({ where: { grupoId: id } })) {
      throw new ApolloError("Grupo em uso", "item in use");
    }

    await Grupo.destroy({
      where: { id, empresaId },
    });

    return 'Grupo excluído com sucesso';
  }
};