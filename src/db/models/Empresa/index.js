const { DataTypes, Model } = require('sequelize');

class Empresa extends Model {
  static init(sequelize) {
    super.init(
      {
        identificador: DataTypes.STRING,
        cnpj: DataTypes.STRING,
        razaoSocial: DataTypes.STRING,
        fantasia: DataTypes.STRING,
        cep: DataTypes.STRING,
        logradouro: DataTypes.STRING,
        numeroLogradouro: DataTypes.STRING,
        bairro: DataTypes.STRING,
        complementoLogradouro: DataTypes.STRING,
        cidadeId: DataTypes.UUID,
        dataCadastro: DataTypes.DATE,
        logoBase64: DataTypes.TEXT,
      },
      {
        sequelize,
        tableName: 'empresas',
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Cidade, {
      foreignKey: 'cidadeId',
      as: 'cidade',
    });
    this.hasMany(models.Usuario, { foreignKey: 'empresaId', as: 'usuarios' });
  }
}

module.exports = Empresa;
