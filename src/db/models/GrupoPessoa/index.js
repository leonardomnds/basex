const { DataTypes, Model } = require('sequelize');

class GrupoPessoa extends Model {
  static init(sequelize) {
    super.init(
      {
        empresaId: DataTypes.UUID,
        descricao: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'grupos_pessoas',
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Empresa, { foreignKey: 'empresaId', as: 'empresa' });
    this.hasMany(models.Pessoa, { foreignKey: 'grupoId', as: 'pessoas' });
  }
}

module.exports = GrupoPessoa;
