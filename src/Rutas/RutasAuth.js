const express = require('express');
const router = express.Router();
const ControladorAuth = require('../Controladores/ControladorAuth'); // Importa correctamente el controlador

// Ruta para iniciar sesión
router.post('/login', ControladorAuth.login);

module.exports = router;

