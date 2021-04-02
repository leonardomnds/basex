module.exports = {
  username: 'postgres', // process.env.DB_USER,
  password: 'postgres', // process.env.DB_PASS,
  database: 'sysdev', // process.env.DB_NAME_HOM,
  host: 'localhost', // process.env.DB_HOST,
  dialect: 'postgres',
  dialectOptions: {
    decimalNumbers: true,
  },
  define: {
    timestamps: false,
  },
};
