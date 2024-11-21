const express = require('express');
const router = express.Router();
const ControladorCita = require('../Controladores/ControladorCitas');


router.post('/citas', ControladorCita.registrarCita);

module.exports = router;