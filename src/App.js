const express = require('express');
const path = require('path');
const cors = require('cors');
const authRutas = require('./Rutas/RutasAuth');
const paciente = require('./Rutas/Pacientes');
const app = express();
require('dotenv').config();


app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/auth', authRutas);
app.use('/api/pacientes', paciente);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
