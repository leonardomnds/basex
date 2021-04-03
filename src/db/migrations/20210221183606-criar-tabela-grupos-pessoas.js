module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() =>
        queryInterface.createTable('grupos_pessoas', {
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
          descricao: {
            type: Sequelize.STRING,
            allowNull: false,
          },
        }),
      ),

  down: async (queryInterface) => queryInterface.dropTable('grupos_pessoas'),
};
