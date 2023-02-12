if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = {
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
};
