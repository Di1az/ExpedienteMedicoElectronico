const Usuario = require('../Modelos/Usuario');
const Paciente = require('../Modelos/Paciente');
const Expediente = require('../Modelos/Expediente');
const Alergia = require('../Modelos/Alergia');
const Enfermedad = require('../Modelos/Enfermedad');
const PacienteAlergia = require('../Modelos/PacienteAlergia');
const PacienteEnfermedad = require('../Modelos/PacienteEnfermedad');
const Cita =require('../Modelos/Cita');

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
const registrarPaciente = async (req, res) => {
  const {
      usuario,
      password,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      curp,
      fechaNacimiento,
      sexo,
      alergias,
      enfermedades,
      expediente
  } = req.body;

  const transaction = await Usuario.sequelize.transaction();

  try {
      const nuevoUsuario = await Usuario.create({
          nombre_usuario: usuario,
          contraseña: password, 
          rol: 'paciente'
      }, { transaction });

      const nuevoPaciente = await Paciente.create({
          nombre,
          apellido_paterno: apellidoPaterno,
          apellido_materno: apellidoMaterno,
          curp,
          fecha_nacimiento: fechaNacimiento,
          sexo,
          id_usuario: nuevoUsuario.id_usuario
      }, { transaction });

      const nuevoExpediente = await Expediente.create({
          pacienteId: nuevoPaciente.id_paciente,
          listaEnfermedades: expediente.listaEnfermedades || null,
          listaAlergias: expediente.listaAlergias || null,
          listaMedicamentos: expediente.listaMedicamentos || null,
          historialCitas: expediente.historialCitas || null,
      }, { transaction });
     
      if (alergias && alergias.length > 0) {
        for (const alergiaNombre of alergias) {
            
            const alergia = await Alergia.findOne({
                where: { nombre: alergiaNombre } 
            });
    
            if (!alergia) {
                throw new Error(`Alergia no encontrada: ${alergiaNombre}`);
            }
    
            await PacienteAlergia.create({
                id_paciente: nuevoPaciente.id_paciente,
                id_alergia: alergia.id_alergia
            }, { transaction });
        }
    }

      if (enfermedades && enfermedades.length > 0) {
          for (const enfermedadNombre of enfermedades) {
                const enfermedad = await Enfermedad.findOne({
                    where: { nombre: enfermedadNombre }
                });

                if (!enfermedad) {
                    throw new Error(`Enfermedad no encontrada: ${enfermedadNombre}`);
                }
              
              await PacienteEnfermedad.create({
                  id_paciente: nuevoPaciente.id_paciente,
                  id_enfermedad: enfermedad.id_enfermedad
              }, { transaction });
          }
      }

      // Confirmar transacción
      await transaction.commit();
      res.status(201).json({ message: 'Paciente registrado exitosamente.' });
  } catch (error) {
      // Revertir transacción en caso de error
      await transaction.rollback();
      console.error(error);
      res.status(500).json({ error: 'Hubo un problema al registrar el paciente.' });
  }
};

module.exports = {
  obtenerPacientes, registrarPaciente
};