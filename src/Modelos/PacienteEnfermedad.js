// src/Modelos/PacienteEnfermedad.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Paciente = require('../Modelos/Paciente');
const Enfermedad = require('./Enfermedad');

const PacienteEnfermedad = sequelize.define('PacienteEnfermedad', {
  id_paciente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Paciente,
      key: 'id_paciente',
    },
  },
  id_enfermedad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Enfermedad,
      key: 'id_enfermedad',
    },
  },
}, {
  tableName: 'PacienteEnfermedades',
  timestamps: false,
});

module.exports = PacienteEnfermedad;
