const { pingHost } = require('../../../Business/services/NetworkToolsServices/pingService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    name: 'ping',
    description: `Verifica si una [IP o dominio] está accesible desde tu red.`,
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [IP o Dominio] para hacer ping 📶: ")), async (dominio) => {
                try {
                    const stdouta = process.stdout; 
                    stdouta.write("⏳ Comprobando latencia con ping..."); 
                    const result = await pingHost(dominio.trim());
                    stdouta.clearLine(0); 
                    stdouta.cursorTo(0); 
                    console.log(result);
                } catch (err) {
                    formatMessage("error",`${err.message}`);
                }
                resolve();
            });
        });
    }
};