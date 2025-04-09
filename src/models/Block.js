const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const File = require('./File');

const Block = sequelize.define('Block', {
  name: { type: DataTypes.STRING, allowNull: false },
  x: { type: DataTypes.FLOAT },
  y: { type: DataTypes.FLOAT },
  type: { type: DataTypes.STRING },
});

File.hasMany(Block);
Block.belongsTo(File);

module.exports = Block;