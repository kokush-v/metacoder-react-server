const { chat, data_b } = require('./db/sequelize');

async function GetAllMessages() {
   var result;

   result = await chat.findAll();

   return result;
}

async function CreateMessage(text, id, dataText, name) {
   var date = new Date();

   var msg = await chat.create({
      text: text,
      uid: id,
      time: date.getTime(),
      date: dataText,
      name: name,
   });
}

async function GetUsers() {
   var result = [];
   var users = await data_b.findAll();
   for (var u of users) {
      var user = {
         id: u.dataValues.id,
         name: u.dataValues.name,
      };
      result.push(user);
   }

   return result;
}

module.exports = {
   GetAllMessages,
   CreateMessage,
   GetUsers,
};
