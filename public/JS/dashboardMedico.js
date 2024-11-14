document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const listaPacientes = document.getElementById('listaPacientes');
  
    // Función para obtener los pacientes
    const cargarPacientes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/pacientes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        if (response.ok) {
          const pacientes = await response.json();
          pacientes.forEach(paciente => {
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
  
    // Cerrar sesión
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  
    // Llamar a la función para cargar los pacientes
    cargarPacientes();
  });
  