document.getElementById('appointmentForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        document.getElementById('errorMessage').textContent = 'No se encontró sesión activa.';
        return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const id_usuario = payload.id_usuario;

    const id_paciente = await obtenerIdPaciente(id_usuario);
    if (!id_paciente) {
        document.getElementById('errorMessage').textContent = 'No se pudo identificar al paciente. Intente de nuevo.';
        return;
    }

    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const doctor = document.getElementById('doctor').value;
    const motivo = document.getElementById('motivo').value;

    if (!fecha || !hora || !doctor || !motivo) {
        document.getElementById('errorMessage').textContent = 'Por favor completa todos los campos.';
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/api/citas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({ id_paciente, fecha, hora, doctor, motivo }),
        });

        if (response.ok) {
            alert('Cita agendada exitosamente');
            window.location.href = "dashboardPaciente.html";

         //   document.getElementById('appointmentForm').reset();
        } else {
            const errorData = await response.json();
            document.getElementById('errorMessage').textContent = errorData.mensaje || 'Error desconocido al agendar la cita.';
        }
    } catch (error) {
        console.error('Error al agendar la cita:', error);
        document.getElementById('errorMessage').textContent = 'Error al conectar con el servidor.';
    }
});

async function obtenerIdPaciente(id_usuario) {
    try {
        const response = await fetch(`http://localhost:3001/api/paciente-usuario/${id_usuario}`);
        if (!response.ok) throw new Error('No se encontró el paciente asociado al usuario.');

        const { id_paciente } = await response.json();
        return id_paciente;
    } catch (error) {
        console.error('Error al obtener el ID del paciente:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        document.getElementById('errorMessage').textContent = 'No se encontró sesión activa.';
        return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const id_usuario = payload.id_usuario;

    await cargarNombrePaciente(id_usuario);
    await cargarDoctores();
});

async function cargarNombrePaciente(id_usuario) {
    try {
        const response = await fetch(`http://localhost:3001/api/paciente-usuario/${id_usuario}`);
        if (!response.ok) throw new Error('No se encontró el paciente asociado al usuario.');

        const { nombre } = await response.json();
        document.getElementById('nombre').value = nombre;
    } catch (error) {
        console.error('Error al cargar el nombre del paciente:', error);
        document.getElementById('errorMessage').textContent = 'Error al cargar el nombre del paciente.';
    }
}

async function cargarDoctores() {
    try {
        const response = await fetch('http://localhost:3001/api/datos/doctores');
        if (!response.ok) throw new Error('No se pudieron cargar los médicos.');

        const doctores = await response.json();
        const doctorSelect = document.getElementById('doctor');

        doctorSelect.innerHTML = '<option value="">Seleccionar médico</option>';

        if (doctores.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No hay doctores disponibles';
            option.disabled = true;
            doctorSelect.appendChild(option);
            return;
        }

        doctores.forEach((doctor) => {
            const option = document.createElement('option');
            option.value = doctor.id_doctor;
            option.textContent = `${doctor.nombre} (${doctor.especialidad})`;
            doctorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los médicos:', error);
        document.getElementById('errorMessage').textContent = 'Error al cargar los médicos.';
    }
}

function back(){
    window.location.href = "dashboardPaciente.html";
}