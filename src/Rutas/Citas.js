const express = require('express');
const router = express.Router();
const ControladorCita = require('../Controladores/ControladorCitas');

router.post('/citas', ControladorCita.registrarCita);

router.get('/obtenerCitas', ControladorCita.obtenerCitasPaciente);

router.patch('/citas/:id/estado', ControladorCita.actualizarEstadoCita);

router.get('/citas/:id_doctor', ControladorCita.obtenerCitasDoctor);

router.get('/citas/:id', ControladorCita.obtenerCitaPorId);

module.exports = router;