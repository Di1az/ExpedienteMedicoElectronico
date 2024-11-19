const express = require('express');
const path = require('path');
const cors = require('cors');
const authRutas = require('./Rutas/RutasAuth');
const pacienteRutas = require('./Rutas/Pacientes');
const datosRouter = require('./Rutas/Datos'); 
const sequelize = require('./config/database');
require('dotenv').config();

// Inicialización de Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rutas
app.use('/api/auth', authRutas);
app.use('/api/pacientes', pacienteRutas);
app.use('/api/datos', datosRouter);

// Sincronización de Sequelize y puesta en marcha del servidor
const PORT = process.env.PORT || 3001;
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error al sincronizar la base de datos:', error);
  });
