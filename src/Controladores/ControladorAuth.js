const jwt = require('jsonwebtoken');
const Usuario = require('../Modelos/Usuario');

const ControladorAuth = {
  login: async (req, res) => {
    const { nombre_usuario, contraseña, tipoUsuario } = req.body;

    try {
      // Buscar el usuario por nombre de usuario
      const usuario = await Usuario.findOne({ where: { nombre_usuario } });

      if (!usuario) {
        return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
      }

      // Comparar la contraseña directamente (sin encriptar)
      if (usuario.contraseña !== contraseña) {
        return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
      }

      if (usuario.rol !== tipoUsuario) {
        return res.status(401).json({ mensaje: `Rol incorrecto, tu no eres un: ${tipoUsuario}`});
      }

      // Crear el token JWT
      const token = jwt.sign(
        { id_usuario: usuario.id_usuario, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Enviar respuesta con el token y rol
      res.json({ token, rol: usuario.rol });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  },
};

module.exports = ControladorAuth;
