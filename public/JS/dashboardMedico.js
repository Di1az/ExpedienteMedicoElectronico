document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const listaPacientes = document.getElementById('listaPacientes');
    const altaPacienteBtn = document.getElementById('altaPacienteBtn');
    
    // Agregar el buscador al DOM
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <span class="search-icon">🔍</span>
        <input type="text" class="search-input" placeholder="Buscar paciente..." id="searchInput">
    `;
    listaPacientes.parentNode.insertBefore(searchContainer, listaPacientes);

    // Función para obtener iniciales
    const getInitials = (nombre, apellido_paterno) => {
        return (nombre[0] + (apellido_paterno ? apellido_paterno[0] : '')).toUpperCase();
    };

    // Función para calcular la edad a partir de la fecha de nacimiento
    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--; 
        }
        return edad;
    };

    const mostrarNombreMedicoLocal = async ()=>{
        const token = localStorage.getItem('token');

        if (!token) {
            document.getElementById('errorMessage').textContent = 'No se encontró sesión activa.';
            return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const id_usuario = payload.id_usuario;

        try {
            const response = await fetch('http://localhost:3001/api/datos/doctores');
            if (!response.ok) throw new Error('No se pudieron cargar los médicos.');
    
            const doctores = await response.json();
            const doctor = doctores.find(d => d.id_doctor === id_usuario);

            if (doctor) {
                document.getElementById('nombreMedico').textContent = `${doctor.nombre} (${doctor.especialidad})`;
            } else {
                document.getElementById('errorMessage').textContent = 'No se encontró un médico asociado a este usuario.';
            }
        } catch (error) {
            console.error('Error al cargar los médicos:', error);
            document.getElementById('errorMessage').textContent = 'Error al cargar los médicos.';
        }    

    };

    // Función para obtener los pacientes
    const cargarPacientes = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/pacientes', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const pacientes = await response.json();
                renderizarPacientes(pacientes);
            } else {
                console.error('Error al cargar pacientes');
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

    // Nueva función para renderizar pacientes
    const renderizarPacientes = (pacientes) => {
        listaPacientes.innerHTML = '';
        pacientes.forEach((paciente) => {
            const li = document.createElement('li');
            li.className = 'paciente-item';
            li.innerHTML = `
                <div class="paciente-details">
                    <div class="avatar">
                        ${getInitials(paciente.nombre, paciente.apellido_paterno)}
                    </div>
                    <div class="paciente-info">
                        <div class="paciente-name">
                            ${paciente.nombre} ${paciente.apellido_paterno} ${paciente.apellido_materno}
                        </div>
                        <div class="paciente-meta">
                            <span>${calcularEdad(paciente.fecha_nacimiento)} años</span>
                            <span>CURP: ${paciente.curp}</span>
                        </div>
                    </div>
                </div>
                </div>
            `;
            listaPacientes.appendChild(li);
        });
    };

    // Agregar funcionalidad de búsqueda
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const pacientesActuales = Array.from(listaPacientes.children);
        
        pacientesActuales.forEach(paciente => {
            const texto = paciente.textContent.toLowerCase();
            paciente.style.display = texto.includes(searchTerm) ? '' : 'none';
        });
    });


    // Función para redirigir al formulario de alta paciente
    const registrarPaciente = () => {
        window.location.href = "altaPaciente.html"; 
    };

    logoutBtn.addEventListener('click', () => {
        console.log('Botón de cerrar sesión presionado');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
    
    
    // Llamar a la función para cargar los pacientes
    cargarPacientes();
    mostrarNombreMedicoLocal();

    // Agregar el evento al botón de alta paciente
    if (altaPacienteBtn) {
        altaPacienteBtn.addEventListener('click', registrarPaciente);
    }
});