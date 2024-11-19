const express = require('express');
const Paciente = require('../Modelos/Paciente');
const { obtenerPacientes } = require('../Controladores/ControladorPacientes'); // Asegúrate de que esta función esté definida correctamente
const { verificarToken } = require('../Middlewares/autenticacionJWT');
const router = express.Router();

// Ruta para obtener todos los pacientes
router.get('/', verificarToken, obtenerPacientes); // Asegúrate de que 'obtenerPacientes' esté bien definida

// Ruta para crear un nuevo paciente
router.post('/', async (req, res) => {
    const { nombre, usuario, contraseña, edad, genero } = req.body;
  
    // Validación básica
    if (!nombre || !usuario || !contraseña || !edad) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }
  
    try {
      // Crear el nuevo paciente
      console.log(req.body);
      const nuevoPaciente = await Paciente.create({
        nombre,
        usuario,
        contraseña, // Asegúrate de que la contraseña esté encriptada si decides usar encriptación
        edad,
        genero,
      });
  
      // Enviar respuesta con el paciente creado
      res.status(201).json(nuevoPaciente);
    } catch (error) {
      console.error("Error al crear paciente:", error);
      res.status(500).json({ mensaje: "Error al registrar paciente" });
    }
  });
module.exports = router;
