const express = require('express');
const Paciente = require('../Modelos/Paciente');
const ControladorPaciente = require('../Controladores/ControladorPacientes');
const { verificarToken } = require('../Middlewares/autenticacionJWT');
const router = express.Router();

// Ruta para obtener todos los pacientes
router.get('/', verificarToken, ControladorPaciente.obtenerPacientes); 

// Ruta para crear un nuevo paciente

router.post('/registrar', ControladorPaciente.registrarPaciente);

module.exports = router;
