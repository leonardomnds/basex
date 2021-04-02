const values = {
  id: '95f6d24a-f954-4195-919f-5ce0e3542413',
  usuario: 'demo',
  senha: '$2b$10$7xgTaNA4sr8YP4vNEYmBa.1DwQ7SnfazVHpZ1K521KT8gYHHzglEW', // 123456
  nome: 'Demonstração',
  email: 'demo@demo.com',
  empresaId: 'b2400413-a82f-4de6-b901-8804ddb5b880',
};

module.exports = {
  up: async (queryInterface) => queryInterface.bulkInsert('usuarios', [values]),

  down: async (queryInterface) => queryInterface.bulkDelete('usuarios'),
};
