if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config();
}

const passport = require('passport');
const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const server = require('http').Server(app);
const io = require('socket.io')(server, {
   cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true,
   },
});

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

const { GetAllMessages, CreateMessage, GetUsers } = require('./chat');
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

app.get('/getusers', async (req, res) => {
   var result = await GetUsers();

   res.send(result);
});

const online = [];

io.on('connection', async (socket) => {
   var user;

   var messages = await GetAllMessages();

   console.log(`User connected ${socket.id}`);

   await socket.on('join', (data) => {
      user = data;

      if (!online.find((e) => e == user.id)) online.push(user.id);

      socket.join('chat');

      io.to('chat').emit('conn_user', { user, online, messages });
   });

   await socket.on('send_message', (data) => {
      var hours = new Date().getHours();
      var min = new Date().getMinutes();

      const dateText = `${hours.toString().length < 2 ? '0' + hours : hours}:${
         min.toString().length < 2 ? '0' + min : min
      }`;

      console.log(data);

      io.to('chat').emit('load_message', { data, date: dateText });

      CreateMessage(data.message, data.user.id, dateText, data.user.name);
   });

   await socket.on('disconnect', () => {
      console.log('disconnect ' + socket.id);
      if (Boolean(user)) online.splice(online.indexOf(user.id), 1);
      console.log(online);
      io.to('chat').emit('log_out', { user, online });
   });
});

server.listen(5000, () => {
   console.log('Server run on port 5000');
});
