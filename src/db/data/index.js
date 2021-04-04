const unidadesMedida = [];

const insertUnidadeMedida = (simbolo, descricao) => {
  unidadesMedida.push({ simbolo, descricao });
};

module.exports = {
  getUnidadesMedida() {
    insertUnidadeMedida('UN', 'UNIDADE');
    insertUnidadeMedida('CX', 'CAIXA');
    insertUnidadeMedida('M', 'METRO');
    return unidadesMedida;
  },
};
