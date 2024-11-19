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
    unique: true, // Evita usuarios duplicados
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 100], // Contraseña debe tener al menos 8 caracteres
    },
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  // Si prefieres tener `createdAt` y `updatedAt`
  timestamps: false, // Habilitado para almacenar las fechas de creación y actualización
});

module.exports = Paciente;
