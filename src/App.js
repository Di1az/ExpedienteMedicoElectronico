const express = require('express');
const path = require('path');
const cors = require('cors');
const authRutas = require('./Rutas/RutasAuth');
const pacienteRutas = require('./Rutas/Pacientes');
const sequelize = require('./database'); // Cambié el path a './database' asumiendo que está en el mismo directorio.
require('dotenv').config();

// Importar todos los modelos para que Sequelize los registre correctamente
const Medico = require('./Modelos/Medico');
const Paciente = require('./Modelos/Paciente');
const Expediente = require('./Modelos/Expediente');
const Cita = require('./Modelos/Cita');

// Inicialización de Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rutas
app.use('/api/auth', authRutas);
app.use('/api/pacientes', pacienteRutas);

// Sincronización de Sequelize y puesta en marcha del servidor
const PORT = process.env.PORT || 3001;
sequelize.sync({ force: true }) // Cambia a `true` solo si quieres recrear las tablas cada vez (esto borrará los datos)
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error al sincronizar la base de datos:', error);
  });
