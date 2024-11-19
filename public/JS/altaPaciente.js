document.getElementById('formAltaPaciente').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const usuario = document.getElementById('usuario').value;
    const contraseña = document.getElementById('password').value;  // Corrige la variable de "password" a "contraseña"
    const edad = document.getElementById('edad').value;
    const genero = document.getElementById('genero').value;
  
    // Verificar si todos los campos están completos
    if (!nombre || !usuario || !contraseña || !edad) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;  // Evita continuar si falta algún campo
    }
  
    const pacienteData = {
      nombre,
      usuario,
      contraseña,
      edad,
      genero,
    };
  
    console.log("Datos enviados:", pacienteData);
  
    try {
      const response = await fetch('http://localhost:3001/api/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pacienteData),
      });
  
      if (response.ok) {
        const nuevoPaciente = await response.json();
        console.log('Paciente registrado:', nuevoPaciente);
        // Redirige a la pantalla de éxito o dashboard
        window.location.href = "dashboardMedico.html";  // Cambiar por la ruta correspondiente
      } else {
        console.error('Error al registrar paciente:', response.statusText);
        // Si hay un error, obtener detalles del servidor
        const errorData = await response.json();
        console.log('Detalles del error:', errorData);
        alert('Error al registrar el paciente. Verifique los datos e intente nuevamente.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Hubo un problema con la conexión. Intente nuevamente más tarde.');
    }
  });
  
  // Función para regresar al dashboard del médico
  function volver() {
    window.location.href = "dashboardMedico.html";
  }
  