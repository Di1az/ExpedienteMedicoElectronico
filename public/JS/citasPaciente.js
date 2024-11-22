// Función para generar la lista de citas
function renderizarCitas(citas) {
    const listaCitas = document.getElementById('appointmentList');
    listaCitas.innerHTML = '';

    // Filtrar solo las citas con estado 'Pendiente'
    const citasPendientes = citas.filter(cita => cita.estado.toLowerCase() === 'pendiente');

    if (citasPendientes.length === 0) {
        document.getElementById('noAppointments').style.display = 'block';
        return;
    } else {
        document.getElementById('noAppointments').style.display = 'none';
    }

    // Función auxiliar para obtener el color según el estado
    const obtenerColorEstado = (estado) => {
        switch (estado.toLowerCase()) {
            case 'pendiente':
                return 'green';
            case 'cancelada':
                return 'red';
            case 'finalizada':
                return 'black';
            default:
                return 'black';
        }
    };

    citasPendientes.forEach(cita => {
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
                    <p>Estado: <span style="color: ${obtenerColorEstado(cita.estado)}">${cita.estado}</span></p>
                    <p>Motivo: ${cita.motivo}</p>
                </div>
            </div>
            <div class="appointment-actions">
                <button class="btn btn-edit">Editar</button>
                <button class="btn btn-cancel" data-id="${cita.id_cita}">Cancelar</button>
            </div>
        `;

        listaCitas.appendChild(elementoCita);
    });

    // Agregar eventos a los botones "Cancelar"
    document.querySelectorAll('.btn-cancel').forEach(boton => {
        boton.addEventListener('click', eliminarCita);
    });
}


// Función para actualizar el estado de la cita
function eliminarCita(evento) {
    const idCita = evento.target.dataset.id; // Obtener el ID de la cita desde el botón

    // Confirmar la acción con el usuario
    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
        return;
    }

    // Hacer una solicitud PATCH a la API
    fetch(`http://localhost:3001/api/citas/${idCita}/estado`, {
        method: 'PATCH',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: 'Cancelada' }),
    })
    .then(respuesta => {
        if (!respuesta.ok) {
            throw new Error('No se pudo cancelar la cita');
        }
        return respuesta.json();
    })
    .then(() => {
        // Eliminar la cita de la lista en la interfaz
        evento.target.closest('.cita-item').remove();

        // Mostrar mensaje si ya no hay citas
        if (document.querySelectorAll('.cita-item').length === 0) {
            document.getElementById('noAppointments').style.display = 'block';
        }

        alert('Estado de la cita actualizado a Cancelada.');
    })
    .catch(error => {
        console.error('Error al actualizar el estado de la cita:', error);
        alert('Hubo un problema al cancelar la cita. Por favor, intenta de nuevo.');
    });
}


// Función para formatear fechas
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    return new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
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
    const citasCombinadas = citas.map(cita => {
        const doctor = doctores.find(doc => doc.id_doctor === cita.id_doctor);
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


