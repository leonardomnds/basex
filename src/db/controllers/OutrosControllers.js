import {
  SomenteNumeros,
  FormatarCep,
  FormatarCnpj,
} from '../../util/functions';
import api from '../../util/ApiSemBase';
import validateAuth from '../config/validateAuth';

const consultarCep = async (cep) => {
  const cepConsultar = SomenteNumeros(cep);

  if (cepConsultar.length === 8) {
    let json = await api.get(`https://viacep.com.br/ws/${cepConsultar}/json/`);

    if (!json || !json.data || json.data.erro) {
      return null;
    }

    json = json.data;

    return {
      cep: FormatarCep(cep),
      logradouro: json.logradouro ? json.logradouro.toUpperCase() : null,
      numeroLogradouro: '',
      bairro: json.bairro ? json.bairro.toUpperCase() : null,
      complementoLogradouro: json.complemento,
      cidade: json.localidade ? json.localidade.toUpperCase() : null,
      uf: json.uf ? json.uf.toUpperCase() : null,
    };
  }
  return null;
};

module.exports = {
  async findCep(_, { cep }, { user }) {
    validateAuth(user);
    const ret = await consultarCep(cep);
    return ret;
  },
  async findCnpj(_, { cnpj }, { user }) {
    validateAuth(user);
    const cnpjConsultar = SomenteNumeros(cnpj);

    if (cnpjConsultar.length === 14) {
      let json = await api.get(
        `https://www.receitaws.com.br/v1/cnpj/${cnpjConsultar}`,
      );

      if (!json || !json.data || json.data.status === 'ERROR') {
        return null;
      }

      json = json.data;

      let endereco;
      if (json.cep) {
        endereco = await consultarCep(json.cep);
        if (endereco && endereco.logradouro && json.numero) {
          endereco.logradouro = `${json.numero}|${endereco.logradouro}`;
        }
      }

      return {
        cnpj: FormatarCnpj(cnpj),
        razaoSocial: json.nome ? json.nome.toUpperCase() : null,
        fantasia: json.fantasia ? json.fantasia.toUpperCase() : null,
        endereco: endereco || null,
      };
    }
    return null;
  },
  findEstados(_, args, { user }) {
    validateAuth(user);
    return [
      { uf: 'AC', descricao: 'ACRE' },
      { uf: 'AL', descricao: 'ALAGOAS' },
      { uf: 'AM', descricao: 'AMAZONAS' },
      { uf: 'AP', descricao: 'AMAPÁ' },
      { uf: 'BA', descricao: 'BAHIA' },
      { uf: 'CE', descricao: 'CEARÁ' },
      { uf: 'DF', descricao: 'DISTRITO FEDERAL' },
      { uf: 'ES', descricao: 'ESPÍRITO SANTO' },
      { uf: 'GO', descricao: 'GOIÁS' },
      { uf: 'MA', descricao: 'MARANHÃO' },
      { uf: 'MG', descricao: 'MINAS GERAIS' },
      { uf: 'MS', descricao: 'MATO GROSSO DO SUL' },
      { uf: 'MT', descricao: 'MATO GROSSO' },
      { uf: 'PA', descricao: 'PARÁ' },
      { uf: 'PB', descricao: 'PARAÍBA' },
      { uf: 'PE', descricao: 'PERNAMBUCO' },
      { uf: 'PI', descricao: 'PIAUÍ' },
      { uf: 'PR', descricao: 'PARANÁ' },
      { uf: 'RJ', descricao: 'RIO DE JANEIRO' },
      { uf: 'RN', descricao: 'RIO GRANDE DO NORTE' },
      { uf: 'RO', descricao: 'RONDÔNIA' },
      { uf: 'RR', descricao: 'RORAIMA' },
      { uf: 'RS', descricao: 'RIO GRANDE DO SUL' },
      { uf: 'SC', descricao: 'SANTA CATARINA' },
      { uf: 'SE', descricao: 'SERJIPE' },
      { uf: 'SP', descricao: 'SÃO PAULO' },
      { uf: 'TO', descricao: 'TOCANTINS' },
    ];
  },
};
