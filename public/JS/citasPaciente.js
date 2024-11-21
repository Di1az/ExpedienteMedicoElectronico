// Función para generar la lista de citas
function renderizarCitas(citas) {
    const listaCitas = document.getElementById('appointmentList');
    listaCitas.innerHTML = '';

    if (citas.length === 0) {
        document.getElementById('noAppointments').style.display = 'block';
        return;
    }

    citas.forEach(cita => {
        const fechaFormateada = formatearFecha(cita.fecha);
        const elementoCita = document.createElement('li');
        elementoCita.classList.add('cita-item');

        elementoCita.innerHTML = `
            <div class="appointment-details">
                <div>
                    <h3>${cita.nombre} - ${cita.especialidad}</h3>
                    <p>${fechaFormateada}</p>
                </div>
                <div>
                    <p>Motivo: ${cita.motivo}</p>
                </div>
            </div>
            <div class="appointment-actions">
                <button class="btn btn-edit">Editar</button>
                <button class="btn btn-cancel">Cancelar</button>
            </div>
        `;

        listaCitas.appendChild(elementoCita);
    });
}

// Obtener datos de citas y doctores
Promise.all([
    fetch('http://localhost:3001/api/obtenerCitas', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).then(respuesta => respuesta.json()),

    fetch('http://localhost:3001/api/datos/doctores', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).then(respuesta => respuesta.json())
])
.then(([citas, doctores]) => {
    // Combinar citas con información del doctor
    const citasCombinadas = citas.map(cita => {
        const doctor = doctores.find(doc => doc.id_doctor === cita.id_doctor); // Asume que las citas tienen un campo doctorId
        return {
            ...cita,
            nombre: doctor ? doctor.nombre : 'Desconocido',
            especialidad: doctor ? doctor.especialidad : 'Sin especialidad'
        };
    });

    renderizarCitas(citasCombinadas);
})
.catch(error => {
    console.error('Error al obtener los datos:', error);
    document.getElementById('noAppointments').style.display = 'block';
});

function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO); // Convierte la fecha ISO a un objeto Date
    const opciones = {
        year: 'numeric',
        month: 'long', // Nombre completo del mes (puedes usar 'short' para el nombre abreviado)
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true // Para formato de 12 horas
    };

    return new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
}

