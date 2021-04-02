const { DataTypes, Model } = require('sequelize');

class Cidade extends Model {
  static init(sequelize) {
    super.init(
      {
        // id: DataTypes.UUID,
        descricao: DataTypes.STRING,
        uf: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'cidades',
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Estado, { foreignKey: 'uf', as: 'estados' });
    this.hasMany(models.Empresa, { foreignKey: 'cidadeId', as: 'empresas' });
  }
}

module.exports = Cidade;
