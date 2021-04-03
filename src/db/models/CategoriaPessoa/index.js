const { DataTypes, Model } = require('sequelize');

class CategoriaPessoa extends Model {
  static init(sequelize) {
    super.init(
      {
        empresaId: DataTypes.UUID,
        descricao: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'categorias_pessoas',
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Empresa, { foreignKey: 'empresaId', as: 'empresa' });
    this.hasMany(models.Pessoa, { foreignKey: 'categoriaId', as: 'pessoas' });
  }
}

module.exports = CategoriaPessoa;
