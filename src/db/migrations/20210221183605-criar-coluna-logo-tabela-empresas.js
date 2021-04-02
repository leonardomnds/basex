module.exports = {
  up: async (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.addColumn('empresas', 'logoBase64', {
        type: Sequelize.TEXT,
      }),
    ]),

  down: async (queryInterface) =>
    Promise.all([queryInterface.removeColumn('empresas', 'logoBase64')]),
};
