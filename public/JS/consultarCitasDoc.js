
let appointments =[];
// Elementos DOM
const appointmentsContainer = document.getElementById('appointmentsContainer');
const filterButtons = document.querySelectorAll('.filter-btn');

// Funciones
function createAppointmentCard(appointment) {
    return `
        <div class="appointment-card" data-id="${appointment.id_cita}" data-status="${appointment.estado}">
            <div class="card-header">
                <span class="patient-name">Paciente ${appointment.patientName}</span>
                <div class="date-time">
                    <span>📅 ${new Date(appointment.fecha).toLocaleDateString()}</span>
                    <span>🕒 ${new Date(appointment.fecha).toLocaleTimeString()}</span>
                </div>
            </div>
            <div class="card-content">
                <div class="info-item">
                    <strong>Motivo:</strong> ${appointment.motivo}
                </div>
                <div class="info-item">
                    <strong>ID Paciente:</strong> ${appointment.id_paciente}
                </div>
            </div>
            <div class="card-actions">
                ${appointment.estado === 'Pendiente' ? `
                    <button class="btn btn-finish" onclick="viewAppointment(${appointment.id_cita})">Consultar</button>
                    <button class="btn btn-cancel" onclick="cancelAppointment(${appointment.id_cita})">Cancelar</button>
                ` : ''} 
            </div>
        </div>
    `;
}

function viewAppointment(id_cita) {
    localStorage.setItem('selectedAppointmentId', id_cita); 
    window.location.href = 'atenderCita.html';
}


function renderAppointments(status) {
    console.log("Estado actual:", status);
    console.log("Citas antes de filtrar:", appointments); 

    // Filtrar las citas basadas en el estado seleccionado
    const filteredAppointments = appointments.filter(app => app.estado === status);

    console.log("Citas filtradas:", filteredAppointments);

    // Renderizar las citas en el contenedor
    appointmentsContainer.innerHTML = filteredAppointments
        .map(appointment => createAppointmentCard(appointment))
        .join('');
}


function finishAppointment(id) {
    const appointment = appointments.find(app => app.id === id);
    if (appointment) {
        appointment.status = 'Finalizada';
        renderAppointments('Pendiente');
    }
}

function cancelAppointment(id) {
    appointments = appointments.filter(app => app.id !== id);
    renderAppointments('Pendiente');
}

// Obtener el ID del doctor desde el token
function obtenerIdDoctor() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Usuario no autenticado. Inicie sesión nuevamente.');
        return null;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id_usuario;
}

async function obtenerCitas(id_doctor) {
    try {
        const response = await fetch(`http://localhost:3001/api/citas/${id_doctor}`);
        if (!response.ok) {
            throw new Error('Error al obtener citas');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al cargar citas:', error);
        return [];
    }
}

async function obtenerPacientes() {
    try {
        const response = await fetch('http://localhost:3001/api/datos/pacientes');
        if (!response.ok) {
            throw new Error('Error al obtener pacientes');
        }
        return await response.json();
    } catch (error) {
        console.error('Error al cargar pacientes:', error);
        return [];
    }
}


async function inicializarCitas() {
    const id_doctor = obtenerIdDoctor();
    if (!id_doctor) return;

    const [citas, pacientes] = await Promise.all([
        obtenerCitas(id_doctor),
        obtenerPacientes()
    ]);

    appointments = citas.map(cita => {
        const paciente = pacientes.find(p => p.id_paciente === cita.id_paciente);
        return {
            ...cita,
            patientName: paciente
                ? `${paciente.nombre} ${paciente.apellido_paterno} ${paciente.apellido_materno}`
                : 'Paciente desconocido', 
        };
    });

    renderAppointments('Pendiente'); 
}

// Event Listeners
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Quitar la clase 'active' de todos los botones
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Añadir la clase 'active' al botón clickeado
        button.classList.add('active');

        // Obtener el filtro del botón clickeado
        const selectedFilter = button.dataset.filter;

        // Renderizar las citas con el filtro seleccionado
        renderAppointments(selectedFilter);
    });
});


function back(){
    window.location.href = "dashboardMedico.html";
}

inicializarCitas();