import { ApolloError } from 'apollo-server-errors';

import Categoria from '../models/CategoriaPessoa';
import Pessoa from '../models/Pessoa';
import validateAuth from '../config/validateAuth';

const { Op } = require('sequelize');

module.exports = {
  selectAll(_, args, { user }) {
    validateAuth(user);
    return Categoria.findAll({
      where: { empresaId: user.empresaId },
      order: ['descricao'],
    });
  },
  async save(_, { id, descricao }, { user }) {
    validateAuth(user);

    if ((descricao || '').length === 0) throw new ApolloError('A descrição precisa ser informada', 'bad request');

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
      throw new ApolloError('Categoria já existe', 'item already exists');
    }

    let json;
    if (id) {
      json = await Categoria.update(
        { descricao },
        {
          where: { id, empresaId: user.empresaId },
        },
      );
    } else {
      json = await Categoria.create({
        descricao,
        empresaId: user.empresaId,
      });
    }

    if (id && !json) {
      throw new ApolloError('Categoria não existe', 'item not found');
    }

    return Categoria.findByPk(id || json.dataValues.id);
  },
  async delete(_, { id }, { user }) {
    validateAuth(user);

    if (await Pessoa.findOne({ where: { categoriaId: id } })) {
      throw new ApolloError(
        'Categoria em uso. Não é possível excluir!',
        'item in use',
      );
    }

    await Categoria.destroy({
      where: { id, empresaId: user.empresaId },
    });

    return 'Categoria excluída com sucesso';
  },
};
