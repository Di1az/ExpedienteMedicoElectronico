const express = require('express');
const router = express.Router();
const ControladorAuth = require('../Controladores/ControladorAuth'); 

router.post('/login', ControladorAuth.login);

module.exports = router;

