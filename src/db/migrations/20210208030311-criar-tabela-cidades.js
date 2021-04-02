module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() =>
        queryInterface.createTable('cidades', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
            allowNull: false,
            primaryKey: true,
          },
          descricao: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          uf: {
            type: Sequelize.STRING(2),
            allowNull: false,
            references: {
              model: 'estados',
              key: 'uf',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
          codigoIbge: {
            type: Sequelize.STRING(20),
          },
          codigoSiafi: {
            type: Sequelize.STRING(20),
          },
        }),
      ),

  down: async (queryInterface) => queryInterface.dropTable('cidades'),
};
