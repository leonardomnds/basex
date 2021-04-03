import { SomenteNumeros, FormatarCep, FormatarCnpj } from '../../util/functions';
import api from "../../util/ApiSemBase";
import validateAuth from '../../db/config/validateAuth';

import Cidade from "../models/Cidade";

const consultarCep = async (cep) => {
  const cepConsultar = SomenteNumeros(cep);

  if (cepConsultar.length === 8) {
    let json = await api.get(`https://viacep.com.br/ws/${cepConsultar}/json/`);

    if (!json || !json.data || json.data.erro) {
      return null;
    }

    json = json.data;

    const cidade = await Cidade.findOne({
      where: {
        uf: json.uf.toUpperCase(),
        descricao: json.localidade.toUpperCase(),
      },
    });

    return {
      cep: FormatarCep(cep),
      logradouro: json.logradouro ? json.logradouro.toUpperCase() : null,
      numeroLogradouro: '',
      bairro: json.bairro ? json.bairro.toUpperCase() : null,
      complementoLogradouro: json.complemento,
      cidade: cidade || null,
    };

  }
  return null;
}

module.exports = {
  async findCep(_, { cep }, { user }) {
    validateAuth(user);
    return await consultarCep(cep);
  },
  async findCnpj(_, { cnpj }, { user }) {
    validateAuth(user);
    const cnpjConsultar = SomenteNumeros(cnpj);

    if (cnpjConsultar.length === 14) {
      let json = await api.get(`https://www.receitaws.com.br/v1/cnpj/${cnpjConsultar}`);

      if (!json || !json.data || json.data.status === 'ERROR') {
        return null;
      }

      json = json.data;

      let endereco;
      if (json.cep) {
        endereco = await consultarCep(json.cep);
        if (endereco && endereco.logradouro && json.numero) {
          endereco.logradouro = json.numero+'|'+endereco.logradouro;
        }
      }

      return {
        cnpj: FormatarCnpj(cnpj),
        razaoSocial: json.nome ? json.nome.toUpperCase() : null,
        fantasia: json.fantasia ? json.fantasia.toUpperCase() : null,
        endereco: endereco || null,
      }

    }
    return null;
  }
}