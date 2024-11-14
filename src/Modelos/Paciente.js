const { DataTypes } = require('sequelize'); 
const sequelize = require('../database.js');

const Paciente = sequelize.define('Paciente', {
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
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: false 
});

module.exports = Paciente;
