const { listCommands } = require('../config/config.js');

module.exports = {
    name: 'help',
    description: 'Muestra la lista de comandos disponibles.',
    execute() {
        console.log(`${listCommands}\n`);
    }
};