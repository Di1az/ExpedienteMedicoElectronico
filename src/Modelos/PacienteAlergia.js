// src/Modelos/PacienteAlergia.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Paciente = require('../Modelos/Paciente');
const Alergia = require('./Alergia');

const PacienteAlergia = sequelize.define('PacienteAlergia', {
  id_paciente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Paciente,
      key: 'id_paciente',
    },
  },
  id_alergia: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Alergia,
      key: 'id_alergia',
    },
  },
}, {
  tableName: 'PacienteAlergias',
  timestamps: false,
});

module.exports = PacienteAlergia;
