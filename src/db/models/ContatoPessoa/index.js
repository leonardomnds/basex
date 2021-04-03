const { DataTypes, Model } = require('sequelize');

class ContatoPessoa extends Model {
  static init(sequelize) {
    super.init(
      {
        pessoaId: DataTypes.UUID,
        nome: DataTypes.STRING,
        descricao: DataTypes.STRING,
        telefone: DataTypes.STRING,
        celular: DataTypes.STRING,
        email: DataTypes.STRING,
        dataCadastro: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'contatos_pessoas',
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Pessoa, {
      foreignKey: 'pessoaId',
      as: 'pessoa',
    });
  }
}

module.exports = ContatoPessoa;
