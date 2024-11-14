const pacientes = [
  { id: 1, nombre: 'Ivan Oswaldo Bustillos Angulo', edad: 45 },
  { id: 2, nombre: 'Daniel Armando Almada Diaz', edad: 30 },
  // Agrega más pacientes según tus necesidades
];

const obtenerPacientes = (req, res) => {
  res.json(pacientes);
};

module.exports = { obtenerPacientes };
