const Paciente = require('../Modelos/Paciente'); // Importa el modelo de Paciente




const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.status(200).json(pacientes);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener pacientes' });
  }
};

// Crear un nuevo paciente
const crearPaciente = async (req, res) => {
  try {
    const { nombre, usuario, contraseña, genero } = req.body;

    // Validar que los campos no estén vacíos
    if (!nombre || !usuario || !contraseña) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Crear el paciente en la base de datos
    const nuevoPaciente = await Paciente.create({
      nombre,
      usuario,
      contraseña,
      genero
    });

    // Responder con el paciente creado
    return res.status(201).json(nuevoPaciente);
  } catch (error) {
    console.error('Error al crear paciente:', error);
    return res.status(500).json({ error: 'Hubo un error al crear el paciente' });
  }
};

module.exports = {
  crearPaciente,
  obtenerPacientes 
};
