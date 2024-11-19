
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('../Modelos/Usuario'); // Importa el modelo de Usuario

const Medico = sequelize.define('Medico', {
  id_doctor: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  especialidad: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario, // Relación con la tabla Usuarios
      key: 'id_usuario',
    },
  },
}, {
  tableName: 'Medicos',
  timestamps: false,
});

module.exports = Medico;
