document.addEventListener('DOMContentLoaded', () => {
  // Obtener el nombre del paciente desde el token o una API
  const token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    document.getElementById('nombrePaciente').textContent = payload.nombre;
  } else {
    alert("No estás autenticado. Por favor, inicia sesión.");
    window.location.href = "login.html";
  }
});

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
  window.location.href = "agendarCita.html";
}

function verCitas() {
  // Redirigir a la página de ver citas
  window.location.href = "misCitas.html";
}
