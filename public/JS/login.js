document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('loginForm'); // Asegúrate de que el id coincida

  if (formLogin) {
    formLogin.addEventListener('submit', async (event) => {
      event.preventDefault();

      const nombre_usuario = document.getElementById('nombreUsuario').value;
      const contraseña = document.getElementById('contraseña').value;

      try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre_usuario, contraseña }),
        });

        if (response.ok) {
          const { token, rol } = await response.json();
          localStorage.setItem('token', token); // Guardar el token en el almacenamiento local

          // Redirigir según el rol del usuario
          if (rol === 'doctor') {
            window.location.href = 'dashboardMedico.html';
          } else if (rol === 'paciente') {
            window.location.href = 'dashboardPaciente.html';
          }
        } else {
          const errorData = await response.json();
          alert(errorData.mensaje || 'Error al iniciar sesión');
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al conectar con el servidor');
      }
    });
  } else {
    console.error("Formulario de inicio de sesión no encontrado.");
  }
});
