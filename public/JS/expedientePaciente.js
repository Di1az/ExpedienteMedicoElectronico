// Funciones auxiliares
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

function calcularEdad(fecha_nacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fecha_nacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

async function obtenerExpediente(pacienteId) {
    try {
        const response = await fetch(`http://localhost:3001/api/expediente/${pacienteId}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos del expediente');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al cargar los datos del expediente.');
        return null;
    }
}

async function inicializarExpediente() {
    const pacienteId = 4; // Cambiar por el ID del paciente que corresponda
    const paciente = await obtenerExpediente(pacienteId);

    if (!paciente) return;

    // Iniciales
    document.getElementById('avatarInitials').textContent = 
        paciente.nombres[0] + paciente.apellidoPaterno[0];

    // Nombre completo
    document.getElementById('patientName').textContent = 
        `${paciente.nombres} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}`;

    // Metadatos
    document.getElementById('patientAge').textContent = 
        `${calcularEdad(paciente.fechaNacimiento)} años`;
    document.getElementById('patientGender').textContent = 
        paciente.sexo === 'hombre' ? 'Masculino' : 'Femenino';
    document.getElementById('patientCURP').textContent = 
        `CURP: ${paciente.curp}`;

    // Información personal
    document.getElementById('birthDate').textContent = 
        formatearFecha(paciente.fechaNacimiento);
    document.getElementById('gender').textContent = 
        paciente.sexo === 'hombre' ? 'Masculino' : 'Femenino';
    document.getElementById('curp').textContent = paciente.curp;
    document.getElementById('lastUpdate').textContent = 
        formatearFecha(new Date());

    // Alergias
    const alergiasContainer = document.getElementById('alergiasList');
    const alergias = Array.isArray(paciente.alergias) ? paciente.alergias : [paciente.alergias];
    if (alergias.length > 0) {
        alergiasContainer.innerHTML = alergias
            .map(alergia => `
                <div class="list-item">
                    <span class="dot dot-red"></span>
                    ${alergia}
                </div>
            `).join('');
    } else {
        alergiasContainer.innerHTML = '<p class="empty-message">No se han registrado alergias</p>';
    }

    // Enfermedades
    const enfermedadesContainer = document.getElementById('enfermedadesList');
    const enfermedades = Array.isArray(paciente.enfermedades) ? paciente.enfermedades : [paciente.enfermedades];
    if (enfermedades.length > 0) {
        enfermedadesContainer.innerHTML = enfermedades
            .map(enfermedad => `
                <div class="list-item">
                    <span class="dot dot-yellow"></span>
                    ${enfermedad}
                </div>
            `).join('');
    } else {
        enfermedadesContainer.innerHTML = '<p class="empty-message">No se han registrado enfermedades</p>';
    }
}

// Manejo de pestañas (igual que antes)
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remover clase active de todas las pestañas
        document.querySelectorAll('.tab').forEach(t => 
            t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => 
            c.classList.remove('active'));

        // Agregar clase active a la pestaña seleccionada
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// Inicializar la aplicación
inicializarExpediente();