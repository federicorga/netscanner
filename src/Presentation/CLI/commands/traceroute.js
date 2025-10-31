const {tracerouteHost} = require('../../../Business/services/NetworkToolsServices/tracerouteService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    name: 'traceroute',
    description: `Realiza una traza del camino que siguen los paquetes de datos hasta un destino mediante (TTL).`,
     execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [IP o Dominio] para hacer traceroute ↪️: ")), async (dominio) => {
                try {
                      const stdouta = process.stdout;
                     stdouta.write("⏳ Trazando ruta hasta el destino...");
                    const result = await tracerouteHost(dominio.trim());
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