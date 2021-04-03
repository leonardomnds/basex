import GraphQLUUID from 'graphql-type-uuid';
import { GraphQLScalarType }  from "graphql";

import Estado from '../../db/models/Estado';
import Cidade from '../../db/models/Cidade';

import Usuario from './Usuario';
import Empresa from './Empresa'
import CategoriaPessoa from './CategoriaPessoa'
import GrupoPessoa from './GrupoPessoa'
import Pessoa from './Pessoa'
import OutrosControllers from './OutrosControllers'

export default {
  UUID: GraphQLUUID,
  Date: new GraphQLScalarType({
    name: 'Date',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    }
  }),
  
  Query: {
    estados() {
      return Estado.findAll({ order: ['uf'] });
    },
    cidades(_, { uf }) {
      return Cidade.findAll({where: { uf: uf.toUpperCase() }});
    },
    consultarCep: OutrosControllers.findCep,
    consultarCnpj: OutrosControllers.findCnpj,
    infoEmpresa: Empresa.getEmpresaById,
    categoriasPessoa: CategoriaPessoa.selectAll,
    gruposPessoa: GrupoPessoa.selectAll,
    pessoa: Pessoa.selectOne,
    pessoas: Pessoa.selectAll,
  },

  Mutation: {
    login: Usuario.login,
    criarUsuario: Usuario.insert,
    criarCategoriaPessoa: CategoriaPessoa.insert,
    alterarCategoriaPessoa: CategoriaPessoa.update,
    deletarCategoriaPessoa: CategoriaPessoa.delete,
    criarGrupoPessoa: GrupoPessoa.insert,
    alterarGrupoPessoa: GrupoPessoa.update,
    deletarGrupoPessoa: GrupoPessoa.delete,
    salvarPessoa: Pessoa.save,
  }
}