const express = require('express');
const router = express.Router();
const Alergia  = require('../Modelos/Alergia');
const Enfermedad = require('../Modelos/Enfermedad');
const Doctor = require('../Modelos/Medico');

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

router.get('/doctores', async (req, res) => {
    try {
        const doctores = await Doctor.findAll({
            attributes: ['id_doctor', 'nombre', 'especialidad']
        });
        res.json(doctores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener la lista de doctores' });
    }
});

module.exports = router;
