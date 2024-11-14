const { DataTypes } = require('sequelize');
const sequelize = require('../database');

// Importar los modelos relacionados
const Medico = require('./Medico');
const Paciente = require('./Paciente');

const Cita = sequelize.define('Cita', {
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  diagnostico: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  listaEnfermedades: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false
});

// Definir relaciones
Cita.belongsTo(Medico, { foreignKey: 'medicoId' });
Cita.belongsTo(Paciente, { foreignKey: 'pacienteId' });

module.exports = Cita;
