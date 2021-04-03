const Sequelize = require('sequelize');
const databaseConfig = require('./config/database');

// Importação dos Models
const Estado = require('./models/Estado');
const Cidade = require('./models/Cidade');
const Empresa = require('./models/Empresa');
const Usuario = require('./models/Usuario');
const CategoriaPessoa = require('./models/CategoriaPessoa');
const GrupoPessoa = require('./models/GrupoPessoa');
const Pessoa = require('./models/Pessoa');
const ContatoPessoa = require('./models/ContatoPessoa');

const models = [
  Estado,
  Cidade,
  Empresa,
  Usuario,
  CategoriaPessoa,
  GrupoPessoa,
  Pessoa,
  ContatoPessoa,
];

class Database {
  constructor() {
    this.init();
    Sequelize.DataTypes.postgres.DECIMAL.parse = parseFloat;
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models),
      );
  }
}

module.exports = new Database();
