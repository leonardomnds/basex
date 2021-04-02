const { DataTypes, Model } = require('sequelize');
//const bcrypt = require('bcrypt');

class Usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        usuario: DataTypes.STRING,
        senha: DataTypes.STRING,
        nome: DataTypes.STRING,
        email: DataTypes.STRING,
        ativo: DataTypes.BOOLEAN,
        empresaId: DataTypes.UUID,
        dataCadastro: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'usuarios',
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Empresa, { foreignKey: 'empresaId', as: 'empresa' });
  }
}

module.exports = Usuario;
