const express = require('express');
const Paciente = require('../Modelos/Paciente');
const ControladorPaciente = require('../Controladores/ControladorPacientes');
const { verificarToken } = require('../Middlewares/autenticacionJWT');
const Expediente = require('../Modelos/Expediente');
const router = express.Router();

router.get('/', verificarToken, ControladorPaciente.obtenerPacientes); 

router.post('/registrar', ControladorPaciente.registrarPaciente);

router.get('/expediente/:id', async (req, res) => {
    try {
        const pacienteId = req.params.id;

        const paciente = await Paciente.findOne({
            where: { id_paciente: pacienteId }
        });

        const expediente = await Expediente.findOne({
            where: { pacienteId: pacienteId }
        }) 

        if (!paciente && !expediente) {
            return res.status(404).json({ message: 'Paciente y Expediente no Encontrados' });
        }

        const pacienteData = {
            nombres: paciente.nombre,  
            apellidoPaterno: paciente.apellido_paterno,
            apellidoMaterno: paciente.apellido_materno,
            sexo: paciente.sexo,
            curp: paciente.curp,
            fechaNacimiento: paciente.fecha_nacimiento,
            alergias: expediente.listaAlergias,
            enfermedades: expediente.listaEnfermedades, 
        };

        res.json(pacienteData);
    } catch (error) {
        console.error('Error al obtener el expediente:', error);
        res.status(500).json({ message: 'Error al obtener el expediente médico' });
    }
});

router.get('/paciente-usuario/:id_usuario', async (req, res) => {
    try {
        const id_usuario = req.params.id_usuario;

        const paciente = await Paciente.findOne({
            where: { id_usuario }, 
            attributes: ['id_paciente', 'nombre'], 
        });

        if (!paciente) {
            return res.status(404).json({ error: 'Paciente no encontrado.' });
        }

        res.json({ id_paciente: paciente.id_paciente, nombre: paciente.nombre, });
    } catch (error) {
        console.error('Error al obtener el paciente:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;