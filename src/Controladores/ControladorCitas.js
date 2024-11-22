const citas = require('../Modelos/Cita');

const registrarCita = async (req, res) => {
    try {
        const { id_paciente, fecha, hora, doctor, motivo } = req.body;

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

module.exports= {registrarCita};