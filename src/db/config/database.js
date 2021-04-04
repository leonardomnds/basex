require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER_DEV,
    password: process.env.DB_PASS_DEV,
    database: process.env.DB_NAME_DEV,
    host: process.env.DB_HOST_DEV,
    dialect: 'postgres',
    dialectOptions: {
      decimalNumbers: true,
    },
    define: {
      timestamps: false,
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      decimalNumbers: true,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    define: {
      timestamps: false,
    },
  },
};

/*
heroku config --app production-app-name
heroku run sequelize db:migrate --env production --app production-app-name
*/
