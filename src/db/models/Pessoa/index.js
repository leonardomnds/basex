const { DataTypes, Model } = require('sequelize');

class Pessoa extends Model {
  static init(sequelize) {
    super.init(
      {
        empresaId: DataTypes.UUID,
        codigo: DataTypes.INTEGER,
        cpfCnpj: DataTypes.STRING,
        nome: DataTypes.STRING,
        fantasia: DataTypes.STRING,
        rgInscEstadual: DataTypes.STRING,
        inscMunicipal: DataTypes.STRING,
        telefone: DataTypes.STRING,
        celular: DataTypes.STRING,
        email: DataTypes.STRING,
        cep: DataTypes.STRING,
        logradouro: DataTypes.STRING,
        numeroLogradouro: DataTypes.STRING,
        bairro: DataTypes.STRING,
        complementoLogradouro: DataTypes.STRING,
        cidadeId: DataTypes.UUID,
        grupoId: DataTypes.UUID,
        categoriaId: DataTypes.UUID,
        ativo: DataTypes.BOOLEAN,
        //tipoCliente: DataTypes.BOOLEAN,
        //tipoFornecedor: DataTypes.BOOLEAN,
        //tipoVendedor: DataTypes.BOOLEAN,
        dataCadastro: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'pessoas',
      },
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Empresa, {
      foreignKey: 'empresaId',
      as: 'empresa',
    });
    this.belongsTo(models.Cidade, {
      foreignKey: 'cidadeId',
      as: 'cidade',
    });
    this.belongsTo(models.GrupoPessoa, { foreignKey: 'grupoId', as: 'grupo' });
    this.belongsTo(models.CategoriaPessoa, {
      foreignKey: 'categoriaId',
      as: 'categoria',
    });
    /*
    this.hasMany(models.ContatoPessoa, {
      foreignKey: 'pessoaId',
      as: 'contatos',
    });*/
  }
}

module.exports = Pessoa;
