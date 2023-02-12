const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail) {
   const authenticateUser = async (email, password, done) => {
      const user = await getUserByEmail(email);

      if (user[0] == undefined) {
         return done(
            null,
            false,
            console.log({ message: 'No user with that email' })
         );
      }

      try {
         if (await bcrypt.compare(password, user[0].dataValues.password)) {
            return done(
               null,
               {
                  id: user[0].dataValues.id,
                  name: user[0].dataValues.name,
               },
               console.log({ LOGIN: 'OK' })
            );
         } else {
            return done(
               null,
               false,
               console.log({
                  message: 'Password incorrect',
                  user: user[0].dataValues,
               })
            );
         }
      } catch (e) {
         return done(e);
      }
   };

   passport.use(
      'login',
      new LocalStrategy({ usernameField: 'email' }, authenticateUser)
   );
}

module.exports = initialize;
