const express = require('express');
const router = express.Router();
const Alergia  = require('../Modelos/Alergia');
const Enfermedad = require('../Modelos/Enfermedad');
const Doctor = require('../Modelos/Medico');
const Paciente = require('../Modelos/Paciente');

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

router.get('/pacientes', async (req, res) => {
    try {
        const pacientes = await Paciente.findAll({
            attributes: ['id_paciente', 'nombre', 'apellido_paterno', 'apellido_materno']
        });
        res.json(pacientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener la lista de pacientes' });
    }
});

module.exports = router;
