const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Doctor = require('./Medico');
const Paciente = require('./Paciente');

const Cita = sequelize.define('Cita', {
  id_cita: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  motivo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  id_doctor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Doctor,
      key: 'id_doctor',
    },
  },
  id_paciente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Paciente,
      key: 'id_paciente',
    },
  },
}, {
  tableName: 'Citas',
  timestamps: false,
});

module.exports = Cita;
