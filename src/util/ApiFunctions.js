import Sequelize from 'sequelize';
import Database from '../db';

module.exports = {
  GetSuccessJson(json) {
    return { sucesso: true, dados: json || [], erros: null };
  },

  GetErrorJson(erros) {
    return { sucesso: false, dados: null, erros };
  },

  GetUuidErrorJson() {
    return this.GetErrorJson('UUID enviado não é válido!');
  },

  GetPermissionErrorJson() {
    return this.GetErrorJson(
      'Você não tem permissão para acessar esse módulo!',
    );
  },

  GetFieldsBySelect(select, as) {
    // GetFieldsBySelect('Select Sum(Tabela1.campo) From Tabela Where Tabela1.campo2 = Tabela2.campo)'), 'Total');
    return [Sequelize.literal(`(${select})`), as];
  },

  async GetTransaction() {
    const t = await Database.connection.transaction();
    return t;
  },
};
