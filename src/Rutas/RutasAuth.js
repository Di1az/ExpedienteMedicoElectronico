const express = require('express');
const { iniciarSesion } = require('../Controladores/ControladorAuth');
const { verificarToken } = require('../Middlewares/autenticacionJWT');
const router = express.Router();

router.post('/login', iniciarSesion);

// Ruta protegida de ejemplo
router.get('/perfil', verificarToken, (req, res) => {
  res.json({ mensaje: `Bienvenido, ${req.usuario.rol}` });
});

module.exports = router;
