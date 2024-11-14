const jwt = require('jsonwebtoken');
const Medico = require('../Modelos/Medico');
const Paciente = require('../Modelos/Paciente');

// Asegúrate de tener una clave secreta para JWT en tu archivo .env
const JWT_SECRET = process.env.JWT_SECRET || 'claveSecretaPorDefecto'; // Cambia 'claveSecretaPorDefecto' en producción

if (JWT_SECRET === 'claveSecretaPorDefecto') {
  console.warn("⚠️ Advertencia: Usando una clave secreta por defecto. Establece JWT_SECRET en tu archivo .env para mayor seguridad.");
}

const iniciarSesion = async (req, res) => {
  const { usuario, contraseña } = req.body;

  try {
    // Primero intenta encontrar un usuario en el modelo Medico
    let usuarioEncontrado = await Medico.findOne({ where: { usuario, contraseña } });
    
    // Si no se encuentra en Medico, intenta en el modelo Paciente
    if (!usuarioEncontrado) {
      usuarioEncontrado = await Paciente.findOne({ where: { usuario, contraseña } });
    }

    // Si no se encuentra en ninguno de los modelos, devuelve error de autenticación
    if (!usuarioEncontrado) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    // Genera el token JWT con el id y rol del usuario encontrado
    const token = jwt.sign(
      {
        id: usuarioEncontrado.id,
        rol: usuarioEncontrado instanceof Medico ? 'medico' : 'paciente'
      },
      JWT_SECRET,
      { expiresIn: '1h' } // Tiempo de expiración del token
    );

    res.json({ mensaje: 'Autenticación exitosa', token, rol: usuarioEncontrado instanceof Medico ? 'medico' : 'paciente' });

  } catch (error) {
    console.error("Error en iniciarSesion:", error);
    res.status(500).json({ mensaje: 'Error del servidor al iniciar sesión' });
  }
};

module.exports = { iniciarSesion };
