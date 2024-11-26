// En database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
   host: process.env.DB_HOST,
   dialect: 'mysql',
   logging: false // Opcional: desactiva los logs de SQL
});

// Prueba de conexión
sequelize.authenticate()
   .then(() => {
     console.log('Conexión a la base de datos establecida correctamente.');
   })
   .catch((error) => {
     console.error('No se pudo conectar a la base de datos:', error);
   });

module.exports = sequelize;