const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa tu conexión a la base de datos

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre_usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  contraseña: {
    type: DataTypes.STRING(255), // Asegúrate de guardar contraseñas hasheadas
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('doctor', 'paciente'),
    allowNull: false,
  },
}, {
  tableName: 'Usuarios',
  timestamps: false,
});

module.exports = Usuario;
