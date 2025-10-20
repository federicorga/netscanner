const {tracerouteHost} = require('../../../Business/services/NetworkToolsServices/tracerouteService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    name: 'traceroute',
    description: `Realiza una traza del camino que siguen los paquetes de datos hasta un destino mediante (TTL).`,
     execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [IP o Dominio] para hacer traceroute ↪️: ")), async (dominio) => {
                try {
                    const result = await tracerouteHost(dominio.trim());
                    console.log(result);
                } catch (err) {
                    formatMessage("error",`${err.message}`);
                }
                resolve();
            });
        });
    }
};