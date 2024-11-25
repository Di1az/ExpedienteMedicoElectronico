const citas = require('../Modelos/Cita');

const registrarCita = async (req, res) => {
    try {
        const { id_paciente, fecha, hora, doctor, motivo, diagnostico } = req.body;

        // Validar datos obligatorios
        if (!id_paciente || !fecha || !hora || !doctor || !motivo) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
        }

        // Formatear fecha y hora en un solo objeto
        const fechaHora = new Date(`${fecha}T${hora}`);
        if (isNaN(fechaHora.getTime())) {
            return res.status(400).json({ mensaje: 'La fecha u hora no son válidas.' });
        }

        // Registrar la cita en la base de datos
        const nuevaCita = await citas.create({
            id_paciente,
            fecha: fechaHora, 
            id_doctor: doctor,
            motivo,
            diagnostico,
        });

        // Responder al cliente con éxito
        res.status(201).json({
            mensaje: 'Cita registrada exitosamente.',
            cita: nuevaCita,
        });
    } catch (error) {
        console.error('Error al registrar la cita:', error);
        res.status(500).json({
            mensaje: 'Error al registrar la cita. Por favor, intenta más tarde.',
        });
    }
}


const obtenerCitasPaciente = async (req,res) =>{
    try {
        const citasObtenidas = await citas.findAll();
        res.status(200).json(citasObtenidas);
      } catch (error) {
        console.error('Error al obtener citas:', error);
        res.status(500).json({ mensaje: 'Error al obtener citas' });
      }
}

const obtenerCitasDoctor = async (req,res) =>{
    const { id_doctor } = req.params;

    try {
        const citasDoc = await citas.findAll({
            where: { id_doctor }
        });

        res.json(citasDoc);
    } catch (error) {
        console.error('Error al obtener citas:', error);
        res.status(500).json({ error: 'No se pudieron obtener las citas' });
    }
}

const actualizarEstadoCita = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la cita en la base de datos
        const cita = await citas.findByPk(id);
        if (!cita) {
            return res.status(404).json({ mensaje: 'Cita no encontrada.' });
        }

        // Actualizar el estado de la cita
        cita.estado = 'Cancelada';
        await cita.save();

        res.status(200).json({ mensaje: 'Estado de la cita actualizado a Cancelada.' });
    } catch (error) {
        console.error('Error al actualizar el estado de la cita:', error);
        res.status(500).json({
            mensaje: 'Error al actualizar el estado de la cita. Por favor, intenta más tarde.',
        });
    }
};

const obtenerCitaPorId = async (req, res) => {
    const  {id_cita}  = req.params;

    try {
        // Buscar solo la cita por su ID
        const cita = await citas.findByPk(id_cita);

        // Verificar si la cita existe
        if (!cita) {
            return res.status(404).json({ mensaje: 'Cita no encontrada.' });
        }

        // Responder con los datos de la cita
        res.status(200).json({
            idCita: cita.id_cita,
            fechaCita: cita.fecha,
            motivo: cita.motivo,
            estado: cita.estado,
            diagnostico: cita.diagnostico,
            idPaciente: cita.id_paciente,
            idDoctor: cita.id_doctor
        });
    } catch (error) {
        console.error('Error al obtener los detalles de la cita:', error);
        res.status(500).json({ mensaje: 'Error al obtener la cita.' });
    }
};

const actualizarDiagnostico = async (req, res) => {
    const { id } = req.params;
    const { diagnostico, estado } = req.body;

    try {
        const cita = await citas.findByPk(id);
        if (!cita) return res.status(404).json({ message: 'Cita no encontrada' });

        cita.diagnostico = diagnostico;
        if (estado) cita.estado = estado;
        await cita.save();

        res.json({ message: 'Cita actualizada exitosamente', cita });
    } catch (error) {
        console.error('Error al actualizar la cita:', error);
        res.status(500).json({ message: 'Error al actualizar la cita' });
    }
};

module.exports= {registrarCita, obtenerCitasPaciente, 
    actualizarEstadoCita, obtenerCitasDoctor, obtenerCitaPorId, actualizarDiagnostico};