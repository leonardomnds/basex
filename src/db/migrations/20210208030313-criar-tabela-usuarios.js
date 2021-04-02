module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() =>
        queryInterface.createTable('usuarios', {
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
          usuario: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          senha: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          nome: {
            type: Sequelize.STRING,
          },
          email: {
            type: Sequelize.STRING,
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

  down: async (queryInterface) => queryInterface.dropTable('usuarios'),
};
