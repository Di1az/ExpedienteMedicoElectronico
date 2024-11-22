// src/Modelos/Alergia.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alergia = sequelize.define('Alergia', {
  id_alergia: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'Alergias',
  timestamps: false,
});

module.exports = Alergia;
