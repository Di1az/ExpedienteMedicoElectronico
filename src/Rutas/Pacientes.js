const express = require('express');
const { obtenerPacientes } = require('../Controladores/ControladorPacientes');
const { verificarToken } = require('../Middlewares/autenticacionJWT');
const router = express.Router();

router.get('/', verificarToken, obtenerPacientes);

module.exports = router;
