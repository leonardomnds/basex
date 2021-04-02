const dataValues = require('../data');

module.exports = {
  up: async (queryInterface) =>
    queryInterface.bulkInsert('cidades', dataValues.getCidades()),

  down: async (queryInterface) => queryInterface.bulkDelete('cidades'),
};
