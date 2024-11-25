// Elementos del DOM
const form = document.getElementById('appointmentForm');
const saveDiagnosisButton = document.getElementById('saveDiagnosisButton').addEventListener('click', guardarDiagnostico);;
const searchAlergiasInput = document.getElementById('searchAlergias');
const searchEnfermedadesInput = document.getElementById('searchEnfermedades');

// Variables globales
let alergias = [];
let enfermedades = [];

// Obtener datos del backend según el endpoint proporcionado
async function obtenerDatos(endpoint) {
    try {
        const response = await fetch(`http://localhost:3001/api/datos/${endpoint}`);
        if (!response.ok) throw new Error('Error al obtener los datos');
        return await response.json();
    } catch (error) {
        console.error(error);
        return []; // Devuelve un array vacío en caso de error
    }
}

// Inicializar formulario con alergias y enfermedades del paciente
async function inicializarFormulario() {
    // Primero obtienes las alergias y enfermedades de la base de datos
    alergias = await obtenerDatos('alergias'); 
    enfermedades = await obtenerDatos('enfermedades'); 

    const idCita = localStorage.getItem('selectedAppointmentId');
    if (!idCita) {
        alert('No se especificó una cita válida.');
        return;
    }

    // Obtener datos de la cita
    const cita = await obtenerDatosCita(idCita);

    // Luego, obtienes el expediente del paciente actual
    const pacienteId = cita.idPaciente;
    const expedientePaciente = await obtenerExpedientePaciente(pacienteId);

    // Filtrar las alergias y enfermedades que están en el expediente del paciente
    const alergiasPaciente = expedientePaciente.alergias.split(',').map(a => a.trim());
    const enfermedadesPaciente = expedientePaciente.enfermedades.split(',').map(e => e.trim());

    // Enfermedades
    const enfermedadesContainer = document.getElementById('enfermedadesLista');

    if (enfermedadesPaciente.length > 0) {
        enfermedadesContainer.innerHTML = enfermedadesPaciente
            .map(enfermedad => `
                <div class="list-item">
                    <span class="dot dot-yellow"></span>
                    ${enfermedad}
                </div>
            `).join('');
    } else {
        enfermedadesContainer.innerHTML = '<p class="empty-message">No se han registrado enfermedades</p>';
    }

    // Alergias
    const alergiasContainer = document.getElementById('alergiasLista');

    if (alergiasPaciente.length > 0) {
        alergiasContainer.innerHTML = alergiasPaciente
            .map(alergia => `
                <div class="list-item">
                    <span class="dot dot-red"></span>
                    ${alergia}
                </div>
            `).join('');
    } else {
        alergiasContainer.innerHTML = '<p class="empty-message">No se han registrado alergias</p>';
    }
}


// Inicializar el formulario y cargar la cita al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    await inicializarFormulario();
    await inicializarAtencionCita(); // Cambiamos `loadAppointment` por esta función
});

// Obtener datos del expediente del paciente
async function obtenerExpedientePaciente(idPaciente) {
    try {
        const response = await fetch(`http://localhost:3001/api/pacientes/expediente/${idPaciente}`);
        if (!response.ok) throw new Error('Error al obtener el expediente del paciente');
        return await response.json(); 
    } catch (error) {
        console.error(error);
        return { alergias: [], enfermedades: [] }; // Devuelve objetos vacíos en caso de error
    }
}

async function obtenerDatosCita(id_cita) {
    try {
        const response = await fetch(`http://localhost:3001/api/citasConsulta/${id_cita}`);
        if (!response.ok) throw new Error('Error al obtener los datos de la cita');

        return await response.json();
    } catch (error) {
        console.error('Error al obtener los datos de la cita:', error);
        return null;
    }
}

// Función para inicializar los datos de la cita
async function inicializarAtencionCita() {
    const idCita = localStorage.getItem('selectedAppointmentId');
    if (!idCita) {
        alert('No se especificó una cita válida.');
        return;
    }

    // Obtener datos de la cita
    const cita = await obtenerDatosCita(idCita);
    if (!cita) {
        alert('No se pudieron cargar los datos de la cita.');
        return;
    }

    // Obtener la lista de pacientes
    const pacientes = await obtenerPacientes();
    const paciente = pacientes.find(paciente => (paciente.id_paciente) === (cita.idPaciente));

    // Asignar datos al formulario
    document.getElementById('patientName').value = paciente 
        ? `${paciente.nombre} ${paciente.apellido_paterno} ${paciente.apellido_materno}`
        : 'Paciente desconocido';
    document.getElementById('appointmentDate').value = cita.fechaCita 
        ? formatearFecha(cita.fechaCita) 
        : 'Sin fecha';
    document.getElementById('appointmentReason').value = cita.motivo || 'Sin motivo especificado';
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

//Guardar Diagnostico
async function guardarDiagnostico() {
    const idCita = localStorage.getItem('selectedAppointmentId');
    if (!idCita) {
        alert('No se especificó una cita válida.');
        return;
    }

    const diagnostico = document.getElementById('diagnosis').value.trim();
    if (!diagnostico) {
        alert('Por favor, escribe un diagnóstico antes de guardar.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/api/citas/${idCita}/diagnostico`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ diagnostico, estado: 'Finalizada' })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al guardar el diagnóstico');
        }

        alert('Diagnóstico guardado y cita finalizada exitosamente.');
        back();
    } catch (error) {
        console.error('Error al guardar el diagnóstico:', error);
        alert('Hubo un problema al guardar el diagnóstico. Inténtalo nuevamente.');
    }
}

function formatearFecha(fecha) {
    if (!fecha) return 'Sin fecha';
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return 'Sin fecha';
    return date.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

function back(){
    
    window.location.href = "consultarCitasDoc.html";
}