require('dotenv').config();

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  dialectOptions: {
    decimalNumbers: true,
    // SSL vai apenas em produção
    ssl: {
      rejectUnauthorized: false,
    },
  },
  define: {
    timestamps: false,
  },
};
