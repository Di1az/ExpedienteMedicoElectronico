// Función para obtener datos del backend según el endpoint proporcionado
async function obtenerDatos(endpoint) {
  try {
      // Realiza una solicitud al endpoint correspondiente
      const respuesta = await fetch(`http://localhost:3001/api/datos/${endpoint}`);
      if (!respuesta.ok) throw new Error('Error al obtener los datos');
      return await respuesta.json();
  } catch (error) {
      console.error(error);
      return []; // Devuelve un array vacío en caso de error
  }
}

// Variables globales para almacenar alergias y enfermedades
let alergias = [];
let enfermedades = [];

// Función para inicializar el formulario con datos de alergias y enfermedades
async function inicializarFormulario() {
  alergias = await obtenerDatos('alergias'); // Obtiene datos de alergias
  enfermedades = await obtenerDatos('enfermedades'); // Obtiene datos de enfermedades

  // Crea las listas de checkboxes en sus respectivos contenedores
  createCheckboxList(alergias.map(a => a.nombre), 'alergiasLista');
  createCheckboxList(enfermedades.map(e => e.nombre), 'enfermedadesLista');
}

// Llamar a la función para inicializar el formulario
inicializarFormulario();

// Función para mostrar una sección específica del formulario
function showTab(tabName) {
  const allTabs = document.querySelectorAll('.form-content');
  allTabs.forEach(tab => tab.classList.remove('active'));

  document.getElementById(tabName).classList.add('active');
}

// Función para crear una lista de checkboxes dinámicamente
function createCheckboxList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Limpia el contenido previo del contenedor

  items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'checkbox-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = item.toLowerCase().replace(/\s+/g, '-');
      checkbox.value = item;

      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.textContent = item;

      div.appendChild(checkbox);
      div.appendChild(label);
      container.appendChild(div);
  });
}

// Función para filtrar elementos según el texto ingresado
function filterItems(searchText, items) {
  return items.filter(item => item.toLowerCase().includes(searchText.toLowerCase()));
}

// Listener para buscar en la lista de alergias
document.getElementById('searchAlergias').addEventListener('input', (e) => {
  const filteredAlergias = filterItems(e.target.value, alergias.map(a => a.nombre));
  createCheckboxList(filteredAlergias, 'alergiasLista');
});

// Listener para buscar en la lista de enfermedades
document.getElementById('searchEnfermedades').addEventListener('input', (e) => {
  const filteredEnfermedades = filterItems(e.target.value, enfermedades.map(e => e.nombre));
  createCheckboxList(filteredEnfermedades, 'enfermedadesLista');
});

// Manejo del formulario de login
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
  }

  showTab('expedienteMedico'); // Muestra la sección de expediente médico
});

// Manejo del formulario de expediente médico
document.getElementById('expedienteForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Datos del usuario
  const usuario = document.getElementById('usuario').value;
  const password = document.getElementById('password').value;

  // Datos del paciente
  const nombre = document.getElementById('nombres').value;
  const apellidoPaterno = document.getElementById('apellidoPaterno').value;
  const apellidoMaterno = document.getElementById('apellidoMaterno').value;
  const curp = document.getElementById('curp').value;
  const fechaNacimiento = document.getElementById('fechaNacimiento').value;
  const sexo = document.getElementById('sexo').value;

  // Alergias y enfermedades seleccionadas
  const alergias = Array.from(document.querySelectorAll('#alergiasLista input:checked'))
      .map(input => input.value);
  const enfermedades = Array.from(document.querySelectorAll('#enfermedadesLista input:checked'))
      .map(input => input.value);

  // Datos del expediente
  const expediente = {
      listaEnfermedades: enfermedades.join(', '),
      listaAlergias: alergias.join(', '),
      listaMedicamentos: '', // Agregar campo en el formulario si es necesario
      historialCitas: '' // Agregar campo en el formulario si es necesario
  };

  try {
      const response = await fetch('http://localhost:3001/api/pacientes/registrar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              usuario,
              password,
              nombre,
              apellidoPaterno,
              apellidoMaterno,
              curp,
              fechaNacimiento,
              sexo,
              alergias,
              enfermedades,
              expediente
          })
      });

      const data = await response.json();
      if (response.ok) {
          alert('Paciente registrado exitosamente');
      } else {
          alert('Error: ' + data.error);
      }
  } catch (error) {
      console.error(error);
      alert('Hubo un problema con la solicitud.');
  }
});

// Función para volver a la sección de usuario
function backToUsuario() {
  showTab('credenciales');
}
