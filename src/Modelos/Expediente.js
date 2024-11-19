const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Importar los modelos relacionados
const Paciente = require('./Paciente');

const Expediente = sequelize.define('Expediente', {
  listaEnfermedades: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  listaAlergias: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  listaMedicamentos: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  historialCitas: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false
});

// Definir relación
Expediente.belongsTo(Paciente, { foreignKey: 'pacienteId' });

module.exports = Expediente;
