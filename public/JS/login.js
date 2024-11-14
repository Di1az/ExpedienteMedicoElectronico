document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const usuario = document.getElementById('usuario').value;
  const contraseña = document.getElementById('password').value;
  const errorMensaje = document.getElementById('errorMensaje');
  
  errorMensaje.textContent = '';

  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario, contraseña }),
    });

    if (!response.ok) {
      throw new Error('Credenciales incorrectas');
    }

    const data = await response.json();

    localStorage.setItem('token', data.token);
    localStorage.setItem('rol', data.rol);

    if (data.rol === 'medico') {
      window.location.href = 'dashboardMedico.html';
    } else if (data.rol === 'paciente') {
      window.location.href = 'dashboardPaciente.html';
    } else {
      console.error('Rol desconocido:', data.rol);
      throw new Error('Rol desconocido');
    }

  } catch (error) {
    errorMensaje.textContent = error.message;
    console.error('Error de autenticación:', error);
  }
});
