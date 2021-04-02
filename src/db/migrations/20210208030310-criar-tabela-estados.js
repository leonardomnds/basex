module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() =>
        queryInterface.createTable('estados', {
          uf: {
            type: Sequelize.STRING(2),
            allowNull: false,
            primaryKey: true,
          },
          descricao: {
            type: Sequelize.STRING,
          },
        }),
      ),

  down: async (queryInterface) => queryInterface.dropTable('estados'),
};
