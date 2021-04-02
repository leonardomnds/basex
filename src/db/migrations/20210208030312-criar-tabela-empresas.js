module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() =>
        queryInterface.createTable('empresas', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
            allowNull: false,
            primaryKey: true,
          },
          identificador: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
          },
          cnpj: {
            type: Sequelize.STRING(20),
          },
          razaoSocial: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          fantasia: {
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
          dataCadastro: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('current_timestamp'),
          },
        }),
      ),

  down: async (queryInterface) => queryInterface.dropTable('empresas'),
};
