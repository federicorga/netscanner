const { clearConsole } = require('../utils/systemCommands.js');

module.exports = {
    name: 'clear',
    description: 'Limpia la consola.',
    execute() {
        clearConsole();
    }
};