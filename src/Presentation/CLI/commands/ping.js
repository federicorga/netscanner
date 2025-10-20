const { pingHost } = require('../../../Business/services/NetworkToolsServices/pingService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    name: 'ping',
    description: `Verifica si una [IP o dominio] está accesible desde tu red.`,
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [IP o Dominio] para hacer ping 📶: ")), async (dominio) => {
                try {
                    const result = await pingHost(dominio.trim());
                    console.log(result);
                } catch (err) {
                    formatMessage("error",`${err.message}`);
                }
                resolve();
            });
        });
    }
};