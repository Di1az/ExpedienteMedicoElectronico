
let appointments =[];
// Elementos DOM
const appointmentsContainer = document.getElementById('appointmentsContainer');
const filterButtons = document.querySelectorAll('.filter-btn');

// Funciones
function createAppointmentCard(appointment) {
    return `
        <div class="appointment-card" data-id="${appointment.id_cita}" data-status="${appointment.estado}">
            <div class="card-header">
                <span class="patient-name">Paciente ${appointment.id_paciente}</span>
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
                    <button class="btn btn-finish" onclick="finishAppointment(${appointment.id_cita})">Finalizar</button>
                    <button class="btn btn-cancel" onclick="cancelAppointment(${appointment.id_cita})">Cancelar</button>
                ` : ''}
            </div>
        </div>
    `;
}

function renderAppointments(status) {
    // Filtrar las citas basadas en el estado seleccionado
    const filteredAppointments = appointments.filter(app => app.estado === status);
    
    // Renderizar las citas en el contenedor
    appointmentsContainer.innerHTML = filteredAppointments
        .map(appointment => createAppointmentCard(appointment))
        .join('');
}


function finishAppointment(id) {
    const appointment = appointments.find(app => app.id === id);
    if (appointment) {
        appointment.status = 'finished';
        renderAppointments('pending');
    }
}

function cancelAppointment(id) {
    appointments = appointments.filter(app => app.id !== id);
    renderAppointments('pending');
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

async function inicializarCitas() {
    const id_doctor = obtenerIdDoctor();
    if (!id_doctor) return;

    appointments = await obtenerCitas(id_doctor);
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


inicializarCitas();