document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const usuario = document.getElementById('usuario').value;
    const contraseña = document.getElementById('password').value;
    const errorMensaje = document.getElementById('errorMensaje');
    
    errorMensaje.textContent = '';
  
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
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
  
      window.location.href = 'dashboardMedico.html'; 
    } catch (error) {
      errorMensaje.textContent = error.message;
    }
  });
  