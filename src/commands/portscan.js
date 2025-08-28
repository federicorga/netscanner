const { getPortsStatus } = require('../services/portScannerService.js');

module.exports = {
    name: 'portscan',
    description: 'Escanea los puertos de una IP o dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question("\n🔎 Ingrese (IP o Dominio), tiempo y puerto(s) para escanear 📡​​: ", async (dominio) => {
                await getPortsStatus(dominio.trim());
                resolve();
            });
        });
    }
};