const { clearConsole } = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    name: 'clear',
    description: 'Limpia la consola.',
    execute() {
        clearConsole();
    }
};