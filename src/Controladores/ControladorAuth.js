const jwt = require('jsonwebtoken');
const { obtenerUsuarioPorCredenciales } = require('../Modelos/Usuarios');
require('dotenv').config();

const iniciarSesion = (req, res) => {
  const { usuario, contraseña } = req.body;
  const usuarioEncontrado = obtenerUsuarioPorCredenciales(usuario, contraseña);

  if (!usuarioEncontrado) {
    return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
  }

  const token = jwt.sign(
    { id: usuarioEncontrado.id, rol: usuarioEncontrado.rol },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ mensaje: 'Autenticación exitosa', token });
};

module.exports = { iniciarSesion };
