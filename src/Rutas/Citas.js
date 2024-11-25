const express = require('express');
const router = express.Router();
const ControladorCita = require('../Controladores/ControladorCitas');

router.post('/citas', ControladorCita.registrarCita);

router.get('/obtenerCitas', ControladorCita.obtenerCitasPaciente);

router.patch('/citas/:id/estado', ControladorCita.actualizarEstadoCita);

router.get('/citas/:id_doctor', ControladorCita.obtenerCitasDoctor);

router.get('/citasConsulta/:id_cita', ControladorCita.obtenerCitaPorId);

router.put('/citas/:id/diagnostico', ControladorCita.actualizarDiagnostico);

module.exports = router;