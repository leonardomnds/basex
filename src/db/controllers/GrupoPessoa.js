import { ApolloError } from 'apollo-server-errors';

import Grupo from '../models/GrupoPessoa';
import Pessoa from '../models/Pessoa';
import validateAuth from '../config/validateAuth';

const { Op } = require('sequelize');

module.exports = {
  selectAll(_, args, { user }) {
    validateAuth(user);
    return Grupo.findAll({
      where: { empresaId: user.empresaId },
      order: ['descricao'],
    });
  },
  async save(_, { id, descricao }, { user }) {
    validateAuth(user);

    if (
      await Grupo.findOne({
        where: {
          descricao,
          empresaId: user.empresaId,
          id: {
            [Op.ne]: id || null,
          },
        },
      })
    ) {
      throw new ApolloError('Grupo já existe', 'item already exists');
    }

    let json;
    if (id) {
      json = await Grupo.update(
        { descricao },
        {
          where: { id, empresaId: user.empresaId },
        },
      );
    } else {
      json = await Grupo.create({
        descricao,
        empresaId: user.empresaId,
      });
    }

    if (id && !json) {
      throw new ApolloError('Grupo não existe', 'item not found');
    }

    return Grupo.findByPk(id || json.dataValues.id);
  },
  async delete(_, { id }, { user }) {
    validateAuth(user);

    if (await Pessoa.findOne({ where: { grupoId: id } })) {
      throw new ApolloError(
        'Grupo em uso. Não é possível excluir!',
        'item in use',
      );
    }

    await Grupo.destroy({
      where: { id, empresaId: user.empresaId },
    });

    return 'Grupo excluído com sucesso';
  },
};
