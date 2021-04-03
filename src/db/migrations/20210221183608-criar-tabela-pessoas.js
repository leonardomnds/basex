module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() =>
        queryInterface.createTable('pessoas', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
            allowNull: false,
            primaryKey: true,
          },
          empresaId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'empresas',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          codigo: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          cpfCnpj: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          nome: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          fantasia: {
            type: Sequelize.STRING,
          },
          rgInscEstadual: {
            type: Sequelize.STRING,
          },
          inscMunicipal: {
            type: Sequelize.STRING,
          },
          telefone: {
            type: Sequelize.STRING(20),
          },
          celular: {
            type: Sequelize.STRING(20),
          },
          email: {
            type: Sequelize.STRING,
          },
          cep: {
            type: Sequelize.STRING(10),
          },
          logradouro: {
            type: Sequelize.STRING,
          },
          numeroLogradouro: {
            type: Sequelize.STRING,
          },
          bairro: {
            type: Sequelize.STRING,
          },
          complementoLogradouro: {
            type: Sequelize.STRING,
          },
          cidadeId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'cidades',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
          grupoId: {
            type: Sequelize.UUID,
            references: {
              model: 'grupos_pessoas',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
          categoriaId: {
            type: Sequelize.UUID,
            references: {
              model: 'categorias_pessoas',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
          ativo: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
          },
          dataCadastro: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('current_timestamp'),
          },
        }),
      ),

  down: async (queryInterface) => queryInterface.dropTable('pessoas'),
};
