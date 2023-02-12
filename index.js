if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config();
}

const passport = require('passport');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const crypto = require('crypto');

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(
   session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
   })
);
app.use(passport.initialize());
app.use(passport.session());

const initPassport = require('./passport/passport-config');

initPassport(
   passport,
   (__email) => {
      const x = user.findAll({
         where: {
            email: __email,
         },
      });
      return x;
   },
   (__id) => {
      const id = user.findAll({
         where: {
            id: __id,
         },
      });
      return id;
   }
);

const axios = require('axios');
const ipCheck = require('./clientIP/ipcheck');

const { reg } = require('./db/db_reg');
const { data_b, chat } = require('./db/sequelize');

const user = data_b;

app.get('/getip', (req, res) => {
   axios
      .get(
         'https://ipgeolocation.abstractapi.com/v1/?api_key=1946f07abb6b4524b503ea9db57bd78f'
      )
      .then((res) => {
         ipCheck(res.data.ip_address, res);
      })
      .catch((error) => {
         console.log(error);
      });
});

app.post('/signup', async (req, res) => {
   // console.log(req.body);

   const name = req.body.name;
   const email = req.body.email;
   const password = req.body.password;

   const response = await reg(name, email, password);

   res.sendStatus(response);
});

app.get('/gettoken', (req, res) => {
   res.send(req.cookies);
});

app.post('/login', (req, res, next) => {
   passport.authenticate('login', async (error, user, info) => {
      if (error) next(error);

      if (!user) res.sendStatus(401);

      if (user) {
         const token = crypto.randomBytes(64).toString('hex');

         res.send({ token: token, user: user });
      }
   })(req, res, next);
});

app.listen(5000, () => {
   console.log('Server run on port 5000');
});
