const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   return sequelize.define(
      'metacoderschat',
      {
         id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
         },
         text: {
            type: DataTypes.STRING(1000),
            allowNull: false,
         },
         user_id: {
            type: DataTypes.INTEGER,
         },
         time: DataTypes.STRING(64),
         date: {
            type: DataTypes.STRING(32),
         },
      },
      { timestamps: false, tableName: 'metacoderschat' }
   );
};
