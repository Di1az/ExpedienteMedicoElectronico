const express = require('express');
const router = express.Router();
const  Alergia  = require('../Modelos/Alergia');
const  Enfermedad = require('../Modelos/Enfermedad');

router.get('/alergias', async (req, res) => {
    try {
        const alergias = await Alergia.findAll({ attributes: ['nombre'] });
        res.json(alergias);
    } catch (error) {
        res.status(500).send('Error al obtener las alergias');
    }
});


router.get('/enfermedades', async (req, res) => {
    try {
        const enfermedades = await Enfermedad.findAll({ attributes: ['nombre'] });
        res.json(enfermedades);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las enfermedades');
    }
});

module.exports = router;
