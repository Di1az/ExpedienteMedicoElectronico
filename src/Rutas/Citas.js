const express = require('express');
const router = express.Router();
const ControladorCita = require('../Controladores/ControladorCitas');


router.post('/citas', ControladorCita.registrarCita);

router.get('/obtenerCitas', ControladorCita.obtenerCitasPaciente);

module.exports = router;