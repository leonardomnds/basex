const values = {
  id: 'b2400413-a82f-4de6-b901-8804ddb5b880',
  identificador: 'demo',
  cnpj: '00.000.000/0000-00',
  razaoSocial: 'RAZÃO SOCIAL DEMONSTRAÇÃO LTDA',
  fantasia: 'FANTASIA DEMONSTRAÇÃO',
  cep: '85910-000',
  logradouro: 'AV. BARÃO DO RIO BRANCO',
  numeroLogradouro: '10',
  bairro: 'CENTRO',
  complementoLogradouro: '',
};

module.exports = {
  up: async (queryInterface) => queryInterface.bulkInsert('empresas', [values]),

  down: async (queryInterface) => queryInterface.bulkDelete('empresas'),
};
