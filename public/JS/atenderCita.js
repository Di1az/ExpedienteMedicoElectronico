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

// Cargar datos de la cita al iniciar la página
async function loadAppointment() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    try {
        const response = await fetch(`http://localhost:3001/api/citas/${id}`);
        const appointment = await response.json();

        // Rellenar los campos de la cita
        document.getElementById('patientName').value = `Paciente ${appointment.id_paciente}`;
        document.getElementById('appointmentDate').value = new Date(appointment.fecha).toLocaleString();
        document.getElementById('appointmentReason').value = appointment.motivo;

        // Marcar las alergias y enfermedades del paciente
        const { alergiasPaciente, enfermedadesPaciente } = appointment;
        marcarCheckboxes('alergiasLista', alergiasPaciente);
        marcarCheckboxes('enfermedadesLista', enfermedadesPaciente);
    } catch (error) {
        console.error('Error al cargar la cita:', error);
    }
}

// Función para marcar checkboxes según los datos del paciente
function marcarCheckboxes(containerId, items) {
    const container = document.getElementById(containerId);
    items.forEach(item => {
        const checkbox = container.querySelector(`input[value="${item}"]`);
        if (checkbox) checkbox.checked = true;
    });
}

// Guardar diagnóstico
saveDiagnosisButton.addEventListener('click', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const diagnosis = document.getElementById('diagnosis').value;

    // Obtener alergias y enfermedades seleccionadas
    const selectedAlergias = Array.from(document.querySelectorAll('#alergiasLista input:checked'))
        .map(input => input.value);
    const selectedEnfermedades = Array.from(document.querySelectorAll('#enfermedadesLista input:checked'))
        .map(input => input.value);

    try {
        const response = await fetch(`http://localhost:3001/api/citas/${id}/diagnostico`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                diagnostico: diagnosis,
                alergias: selectedAlergias,
                enfermedades: selectedEnfermedades
            }),
        });

        if (response.ok) {
            alert('Diagnóstico guardado correctamente.');
            window.location.href = 'consultarCitasDoc.html';
        } else {
            alert('Error al guardar el diagnóstico.');
        }
    } catch (error) {
        console.error('Error al guardar el diagnóstico:', error);
    }
});

// Inicializar el formulario y cargar la cita al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    inicializarFormulario();
    loadAppointment();
});
