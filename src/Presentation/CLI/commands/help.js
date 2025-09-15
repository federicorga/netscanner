const fs = require('fs');
const path = require('path');
const { consoleStyles, consoleControl } = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    name: 'help',
    description: 'Muestra la lista de comandos disponibles.',
    execute() {
        const commandsPath = path.join(__dirname);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        let commands = [];
        for (const file of commandFiles) {
            try {
                const command = require(path.join(commandsPath, file));
                if (command.name && command.description) {
                    commands.push({ name: command.name, description: command.description });
                }
            } catch (error) {
                // No hacer nada si un archivo de comando no se puede cargar
            }
        }

        // Ordenar comandos alfabéticamente
        commands.sort((a, b) => a.name.localeCompare(b.name));

        let helpOutput = `\n  ${consoleStyles.text.green}COMANDOS DISPONIBLES:${consoleControl.resetStyle}\n\n`;
   

   

        commands.forEach(command => {
            const name = command.name.padEnd(17);
            const description = command.description.padEnd(56);
            helpOutput += `  ${consoleControl.resetStyle} ${consoleStyles.text.lightCyan}${name}${consoleControl.resetStyle} ${description}\n`;
        });

       

        console.log(helpOutput);
    }
};