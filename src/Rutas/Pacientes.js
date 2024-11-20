const express = require('express');
const Paciente = require('../Modelos/Paciente');
const Alergia = require('../Modelos/Alergia'); 
const Enfermedad = require('../Modelos/Enfermedad');
const ControladorPaciente = require('../Controladores/ControladorPacientes');
const { verificarToken } = require('../Middlewares/autenticacionJWT');
const Expediente = require('../Modelos/Expediente');
const router = express.Router();

// Ruta para obtener todos los pacientes
router.get('/', verificarToken, ControladorPaciente.obtenerPacientes); 

// Ruta para crear un nuevo paciente

router.post('/registrar', ControladorPaciente.registrarPaciente);

// Ruta para obtener el expediente médico de un paciente por su ID
router.get('/expediente/:id', async (req, res) => {
    try {
        const pacienteId = req.params.id;

        // Buscar al paciente y sus datos relacionados
        const paciente = await Paciente.findOne({
            where: { id_paciente: pacienteId }
        });

        const expediente = await Expediente.findOne({
            where: { pacienteId: pacienteId }
        }) 

        if (!paciente && !expediente) {
            return res.status(404).json({ message: 'Paciente y Expediente no Encontrados' });
        }

        // Asegúrate de que los datos estén en el formato correcto
        const pacienteData = {
            nombres: paciente.nombre,  // Asegúrate de que este sea el campo correcto
            apellidoPaterno: paciente.apellido_paterno,
            apellidoMaterno: paciente.apellido_materno,
            sexo: paciente.sexo,
            curp: paciente.curp,
            fechaNacimiento: paciente.fecha_nacimiento,
            alergias: expediente.listaAlergias, // Esto debe ser un array de alergias
            enfermedades: expediente.listaEnfermedades, // Esto debe ser un array de enfermedades
        };

        res.json(pacienteData);
    } catch (error) {
        console.error('Error al obtener el expediente:', error);
        res.status(500).json({ message: 'Error al obtener el expediente médico' });
    }
});

module.exports = router;