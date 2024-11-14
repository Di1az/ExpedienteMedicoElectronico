const { DataTypes } = require('sequelize');
const sequelize = require('../database.js');

const Medico = sequelize.define('Medico', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false 
});

module.exports = Medico;
