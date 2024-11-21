document.addEventListener('DOMContentLoaded', async () => {
  // Obtener el nombre del paciente desde el token o una API
  const token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const id_usuario = payload.id_usuario;

    // Llama a la función cargarNombrePaciente y espera su resultado
    const nombrePaciente = await cargarNombrePaciente(id_usuario);
    document.getElementById('nombrePaciente').textContent = nombrePaciente || 'Paciente';
  } else {
    alert("No estás autenticado. Por favor, inicia sesión.");
    window.location.href = "login.html";
  }
});


async function cargarNombrePaciente(id_usuario) {
  try {
    const response = await fetch(`http://localhost:3001/api/paciente-usuario/${id_usuario}`);
    if (!response.ok) throw new Error('No se encontró el paciente asociado al usuario.');

    const { nombre } = await response.json();
    return nombre; // Devuelve el nombre del paciente
  } catch (error) {
    console.error('Error al cargar el nombre del paciente:', error);
    document.getElementById('errorMessage').textContent = 'Error al cargar el nombre del paciente.';
    return null; // Devuelve null en caso de error
  }
}

// Función para cerrar sesión
function cerrarSesion() {
  // Eliminar el token del localStorage
  localStorage.removeItem('token');
  
  // Redirigir al login
  window.location.href = "login.html";
}

function verExpediente() {
  // Redirigir o mostrar el expediente del paciente
  window.location.href = "expedientePaciente.html";
}

function agendarCita() {
  // Redirigir a la página de agendar citas
  window.location.href = "agendarCitaPaciente.html";
}

function verCitas() {
  // Redirigir a la página de ver citas
  window.location.href = "citasPaciente.html";
}
