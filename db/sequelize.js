if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config();
}
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
   process.env.DATABASE,
   process.env.USER,
   process.env.PASSWORD,
   {
      dialect: 'mysql',
      host: process.env.HOST,
      port: process.env.PORT,
      logging: false,
   }
);

const dBase = require('./db_table')(sequelize);
const Chat = require('./db_table_chat')(sequelize);

Chat.belongsTo(dBase, {
   foreignKey: 'user_id',
});

sequelize.sync({ force: false, alter: true }).then(() => {
   console.log({ DB_INFO: 'Database connected and synced!' });
});

module.exports = {
   sequelize: sequelize,
   data_b: dBase,
   chat: Chat,
};
