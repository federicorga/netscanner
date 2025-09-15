const { getPortsStatus } = require('../../../Business/services/portScannerService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    name: 'portscan',
    description: 'Escanea los puertos de una [IP o dominio].',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [IP o dominio][timeout][Puerto(s)] para escanear 📡​​: ")), async (dominio) => {
                await getPortsStatus(dominio.trim());
                resolve();
            });
        });
    }
};