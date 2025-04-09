const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const File = sequelize.define('File', {
  name: { type: DataTypes.STRING, allowNull: false },
  uploadDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = File;