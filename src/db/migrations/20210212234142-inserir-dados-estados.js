const dataValues = require('../data');

module.exports = {
  up: async (queryInterface) =>
    queryInterface.bulkInsert('estados', dataValues.getEstados()),

  down: async (queryInterface) => queryInterface.bulkDelete('estados'),
};
