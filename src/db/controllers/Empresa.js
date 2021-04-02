import Empresa from '../models/Empresa';

module.exports = {
  getEmpresaById(_, { identificadorEmpresa }) {
    return Empresa.findOne({
      attributes: ['fantasia', 'logoBase64'],
      where: { identificador: identificadorEmpresa },
    });
  }
};