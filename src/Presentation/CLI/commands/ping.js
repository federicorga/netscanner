const { pingHost } = require('../../../Business/services/pingService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    name: 'ping',
    description: `Verifica si una [IP o dominio] está accesible desde tu red.`,
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [IP o Dominio] para hacer ping 📶: ")), async (dominio) => {
                try {
                    const resultado = await pingHost(dominio.trim());
                    console.log(resultado);
                } catch (err) {
                    console.error("❗ [Error] al hacer ping:", err);
                }
                resolve();
            });
        });
    }
};