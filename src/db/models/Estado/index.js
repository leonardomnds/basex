const { DataTypes, Model } = require('sequelize');

class Estado extends Model {
  static init(sequelize) {
    super.init(
      {
        uf: {
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        descricao: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'estados',
      },
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Cidade, { foreignKey: 'uf', as: 'cidades' });
  }
}

module.exports = Estado;
