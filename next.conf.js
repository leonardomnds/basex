require('dotenv').config();

module.exports = {
  env: {
    NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL,
    JWT_KEY = process.env.JWT_KEY,
    
    DB_HOST = process.env.DB_HOST,
    DB_NAME = process.env.DB_NAME,
    DB_USER = process.env.DB_USER,
    DB_PASS = process.env.DB_PASS,
    
    DB_HOST_PROD = process.env.DB_HOST_PROD,
    DB_NAME_PROD = process.env.DB_NAME_PROD,
    DB_USER_PROD = process.env.DB_USER_PROD,
    DB_PASS_PROD = process.env.DB_PASS_PROD,
  },
};
