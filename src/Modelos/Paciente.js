// src/Modelos/Pacientes.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('../Modelos/Usuario'); // Importa el modelo de Usuario
const PacienteEnfermedad = require('./PacienteEnfermedad');
const PacienteAlergia = require('./PacienteAlergia');
const Enfermedad = require('./Enfermedad');
const Alergia = require('./Alergia');

const Paciente = sequelize.define('Paciente', {
  id_paciente: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido_paterno: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido_materno: {
    type: DataTypes.STRING(100),
    allowNull: true, // En caso de que no siempre se proporcione
  },
  sexo: {
    type: DataTypes.ENUM('hombre', 'mujer'),
    allowNull: false,
  },
  curp: {
    type: DataTypes.STRING(18), // El CURP tiene 18 caracteres
    allowNull: false,
    unique: true, // Cada CURP debe ser único
  },
  fecha_nacimiento: {
    type: DataTypes.DATE,
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
  tableName: 'Pacientes',
  timestamps: false,
});


// Relación Paciente-Enfermedad
Paciente.belongsToMany(Enfermedad, {
  through: PacienteEnfermedad,
  foreignKey: 'id_paciente',
  otherKey: 'id_enfermedad',
});

Enfermedad.belongsToMany(Paciente, {
  through: PacienteEnfermedad,
  foreignKey: 'id_enfermedad',
  otherKey: 'id_paciente',
});

// Relación Paciente-Alergia
Paciente.belongsToMany(Alergia, {
  through: PacienteAlergia,
  foreignKey: 'id_paciente',
  otherKey: 'id_alergia',
});

Alergia.belongsToMany(Paciente, {
  through: PacienteAlergia,
  foreignKey: 'id_alergia',
  otherKey: 'id_paciente',
});
module.exports = Paciente
