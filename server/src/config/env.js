//Carga .env y comprueba que PORT exista

require('dotenv').config();

if (!process.env.PORT && require.main === module) {
  throw new Error('El puerto no está definido');
}

module.exports = {
   PORT: process.env.PORT || 3000
};