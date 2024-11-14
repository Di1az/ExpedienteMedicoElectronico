const usuarios = [
    { id: 1, rol: 'medico', usuario: 'medico', contraseña: 'MedMayab1234' },
    { id: 2, rol: 'paciente', usuario: 'paciente', contraseña: 'PacMayab1234' },
  ];
  
  const obtenerUsuarioPorCredenciales = (usuario, contraseña) => {
    return usuarios.find(
      (u) => u.usuario === usuario && u.contraseña === contraseña
    );
  };
  
  module.exports = { obtenerUsuarioPorCredenciales };
  