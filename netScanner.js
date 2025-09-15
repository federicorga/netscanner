const fs = require('fs');
const path = require('path');
const { logo } = require('./src/utils/logoCMD.js');
const { StartCLI } = require('./src/Presentation/CLI/startCLI.js');
const {setDNSProvider} = require('./src/Infrastructure/repository/clients/api/DNSClient.js');
const { consoleStyles, consoleControl } = require('./src/Presentation/CLI/systemCommands.js');
// Cargar comandos dinámicamente
const commands = new Map();
const commandsPath = path.join(__dirname, 'src','Presentation','CLI', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        const command = require(path.join(commandsPath, file));
        if (command.name) {
            commands.set(command.name, command);
        } else {
            console.log(`[Advertencia] El archivo de comando en ${file} no tiene una propiedad 'name'.`);
        }
    } catch (error) {
        console.error(`[Error] No se pudo cargar el comando desde ${file}:`, error);
    }
}

// Configuración inicial de la API
setDNSProvider("googledns");

// Muestra el logo al iniciar el programa
console.log(`${logo}`);

const rl = StartCLI();

async function preguntar() {
    const prompt = `\n${consoleStyles.text.gray}netscanner${consoleControl.resetStyle} ${consoleStyles.text.lightBlue}›${consoleControl.resetStyle} `;
    rl.question(prompt, async (input) => {
        const commandName = input.trim().toLowerCase();
        const command = commands.get(commandName);

        if (!command) {
            console.log("❌ Comando no válido. Escribe un comando correcto o 'help' para ver los comandos disponibles.");
            preguntar();
            return;
        }

        try {
            const shouldContinue = await command.execute(rl);
            if (shouldContinue !== false) {
                preguntar();
            }
        } catch (error) {
            console.error(`❗ [Error] al ejecutar el comando '${commandName}':`, error);
            preguntar(); // Vuelve a preguntar incluso si hay un error
        }
    });
}

// Iniciar el bucle de la CLI
preguntar();
