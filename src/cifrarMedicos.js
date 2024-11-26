const bcrypt = require('bcrypt');
const Usuario  = require('./Modelos/Usuario');
const sequelize = require('./config/database');

const insertarUsuariosCifrados = async () => {
   try {
     // Sincroniza el modelo con la base de datos
     await sequelize.sync();

     const usuarios = [
       { nombre_usuario: 'juanperez', contraseña: 'juan1234', rol: 'doctor' },
       { nombre_usuario: 'marialopez', contraseña: 'maria1234', rol: 'doctor' },
       { nombre_usuario: 'carlosgomez', contraseña: 'carlos1234', rol: 'doctor' },
       { nombre_usuario: 'anatorres', contraseña: 'ana1234', rol: 'doctor' },
       { nombre_usuario: 'miguelramirez', contraseña: 'miguel1234', rol: 'doctor' },
       { nombre_usuario: 'lauramartinez', contraseña: 'laura1234', rol: 'doctor' },
       { nombre_usuario: 'jorgehernandez', contraseña: 'jorge1234', rol: 'doctor' },
       { nombre_usuario: 'patriciadiaz', contraseña: 'patricia1234', rol: 'doctor' },
       { nombre_usuario: 'andrescastillo', contraseña: 'andres1234', rol: 'doctor' },
       { nombre_usuario: 'rosaflores', contraseña: 'rosa1234', rol: 'doctor' },
       { nombre_usuario: 'antoniomorales', contraseña: 'antonio1234', rol: 'doctor' },
       { nombre_usuario: 'beatrizsanchez', contraseña: 'beatriz1234', rol: 'doctor' },
     ];

     for (const usuario of usuarios) {
       const contraseñaCifrada = await bcrypt.hash(usuario.contraseña, 10);
       
       // Usa findOrCreate para evitar duplicados
       const [usuarioCreado, creado] = await Usuario.findOrCreate({
         where: { nombre_usuario: usuario.nombre_usuario },
         defaults: {
           nombre_usuario: usuario.nombre_usuario,
           contraseña: contraseñaCifrada,
           rol: usuario.rol
         }
       });

       if (creado) {
         console.log(`Usuario ${usuario.nombre_usuario} insertado con éxito.`);
       } else {
         console.log(`Usuario ${usuario.nombre_usuario} ya existe.`);
       }
     }

     console.log('Proceso completado.');
     await sequelize.close(); // Cierra la conexión a la base de datos
   } catch (err) {
     console.error('Error durante el proceso de inserción:', err);
     await sequelize.close();
   }
};

// Ejecuta la función
insertarUsuariosCifrados();