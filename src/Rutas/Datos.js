const express = require('express');
const controladorDatos = require('../Controladores/ControladorDatos')
const router = express.Router();

router.get('/alergias', controladorDatos.obtenerAlergias);

router.get('/enfermedades', controladorDatos.obtenerEnfermedades);

router.get('/doctores', controladorDatos.obtenerDoctores);

router.get('/pacientes', controladorDatos.obtenerPacientes);

module.exports = router;
