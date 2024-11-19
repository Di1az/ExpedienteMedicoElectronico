// src/Modelos/Enfermedad.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enfermedad = sequelize.define('Enfermedad', {
  id_enfermedad: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'Enfermedades',
  timestamps: false,
});

module.exports = Enfermedad;
