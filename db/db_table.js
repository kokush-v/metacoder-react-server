const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   return sequelize.define(
      'metacodersdatabase',
      {
         id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
         },
         name: {
            type: DataTypes.STRING(30),
            allowNull: false,
         },
         email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
         },
         password: {
            type: DataTypes.STRING(150),
            allowNull: false,
         },

         Date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
         },
      },
      { timestamps: false, tableName: 'metacodersdatabase' }
   );
};
