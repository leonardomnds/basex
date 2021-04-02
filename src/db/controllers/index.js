import Estado from '../../db/models/Estado';
import Cidade from '../../db/models/Cidade';

import Usuario from './Usuario';
import Empresa from './Empresa'

export default {
  Query: {
    estados() {
      return Estado.findAll({ order: ['uf'] });
    },
    cidades(_, { uf }) {
      return Cidade.findAll({where: { uf: uf.toUpperCase() }});
    },
    infoEmpresa: Empresa.getEmpresaById,
  },

  Mutation: {
    login: Usuario.login,
    criarUsuario: Usuario.insert,
  }
}