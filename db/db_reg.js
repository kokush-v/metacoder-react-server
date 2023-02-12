const bcrypt = require('bcrypt');
const { data_b } = require('./sequelize');

const user = data_b;

async function reg(_name, _email, _password) {
   const hashPassword = await bcrypt.hash(_password, 10);

   var StatusError;
   await user
      .create({
         name: _name,
         email: _email,
         password: hashPassword,
      })
      .then(() => {
         console.log({ REGISTRATION: 'completed' });
         StatusError = 200;
      })
      .catch((e) => {
         console.log({ REGISTRATION: 'failed' });
         StatusError = 401;
      });

   return StatusError;
}

module.exports = { reg };
