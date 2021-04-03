module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() =>
        queryInterface.createTable('contatos_pessoas', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
            allowNull: false,
            primaryKey: true,
          },
          pessoaId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'pessoas',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          nome: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          descricao: {
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
          dataCadastro: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('current_timestamp'),
          },
        }),
      ),

  down: async (queryInterface) => queryInterface.dropTable('contatos_pessoas'),
};
