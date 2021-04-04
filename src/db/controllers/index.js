import GraphQLUUID from 'graphql-type-uuid';
import { GraphQLScalarType } from 'graphql';

import Usuario from './Usuario';
import Empresa from './Empresa';
import CategoriaPessoa from './CategoriaPessoa';
import GrupoPessoa from './GrupoPessoa';
import Pessoa from './Pessoa';
import OutrosControllers from './OutrosControllers';

export default {
  UUID: GraphQLUUID,
  Date: new GraphQLScalarType({
    name: 'Date',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    },
  }),

  Query: {
    estados: OutrosControllers.findEstados,
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
    salvarCategoriaPessoa: CategoriaPessoa.save,
    deletarCategoriaPessoa: CategoriaPessoa.delete,
    salvarGrupoPessoa: GrupoPessoa.save,
    deletarGrupoPessoa: GrupoPessoa.delete,
    salvarPessoa: Pessoa.save,
  },
};
