document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const listaPacientes = document.getElementById('listaPacientes');
    const altaPacienteBtn = document.getElementById('altaPacienteBtn');



    
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
                pacientes.forEach((paciente) => {
                    const li = document.createElement('li');
                    li.textContent = `Paciente: ${paciente.nombre} - Edad: ${paciente.edad}`;
                    listaPacientes.appendChild(li);
                });
            } else {
                console.error('Error al cargar pacientes');
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };

    // Función para redirigir al formulario de alta paciente
    const registrarPaciente = () => {
        window.location.href = "altaPaciente.html";  // Cambiar por la ruta correcta
    };

    logoutBtn.addEventListener('click', () => {
        console.log('Botón de cerrar sesión presionado');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
    
    // Llamar a la función para cargar los pacientes
    cargarPacientes();

    // Agregar el evento al botón de alta paciente
    if (altaPacienteBtn) {
        altaPacienteBtn.addEventListener('click', registrarPaciente);
    }
});
