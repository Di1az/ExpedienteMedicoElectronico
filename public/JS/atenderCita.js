// Elementos del DOM
const form = document.getElementById('appointmentForm');
const saveDiagnosisButton = document.getElementById('saveDiagnosisButton');
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

// Crear lista de checkboxes dinámicamente
function createCheckboxList(items, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Limpia contenido previo

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = item.toLowerCase().replace(/\s+/g, '-');
        checkbox.value = item;

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = item;

        div.appendChild(checkbox);
        div.appendChild(label);
        container.appendChild(div);
    });
}

// Filtrar elementos según texto ingresado
function filterItems(searchText, items) {
    return items.filter(item => item.toLowerCase().includes(searchText.toLowerCase()));
}

// Inicializar listas de alergias y enfermedades
async function inicializarFormulario() {
    alergias = await obtenerDatos('alergias'); // Obtiene datos de alergias
    enfermedades = await obtenerDatos('enfermedades'); // Obtiene datos de enfermedades

    // Crear listas de checkboxes
    createCheckboxList(alergias.map(a => a.nombre), 'alergiasLista');
    createCheckboxList(enfermedades.map(e => e.nombre), 'enfermedadesLista');
}

// Listeners para búsqueda en las listas
searchAlergiasInput.addEventListener('input', (e) => {
    const filteredAlergias = filterItems(e.target.value, alergias.map(a => a.nombre));
    createCheckboxList(filteredAlergias, 'alergiasLista');
});

searchEnfermedadesInput.addEventListener('input', (e) => {
    const filteredEnfermedades = filterItems(e.target.value, enfermedades.map(e => e.nombre));
    createCheckboxList(filteredEnfermedades, 'enfermedadesLista');
});

// Inicializar el formulario y cargar la cita al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    await inicializarFormulario();
    await inicializarAtencionCita(); // Cambiamos `loadAppointment` por esta función
});

// Función para inicializar los datos de la cita
async function inicializarAtencionCita() {
    // Obtener el ID de la cita desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idCita = urlParams.get('id');

    if (!idCita) {
        alert('No se especificó una cita válida.');
        return;
    }

    console.log('ID de la cita obtenido:', idCita);

    // Obtener datos de la cita
    const cita = await obtenerDatosCita(idCita);

    if (!cita) {
        alert('No se pudieron cargar los datos de la cita.');
        return;
    }

    // Asignar datos al formulario
    document.getElementById('patientName').value = cita.nombrePaciente || 'Desconocido';
    document.getElementById('appointmentDate').value = cita.fechaCita ? formatearFecha(cita.fechaCita) : 'Sin fecha';
    document.getElementById('appointmentReason').value = cita.motivo || 'Sin motivo especificado';
}

async function obtenerDatosCita(idCita) {
    try {
        const response = await fetch(`http://localhost:3001/api/citas/${idCita}`);
        if (!response.ok) throw new Error('Error al obtener los datos de la cita');

        return await response.json();
    } catch (error) {
        console.error('Error al obtener los datos de la cita:', error);
        return null;
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

