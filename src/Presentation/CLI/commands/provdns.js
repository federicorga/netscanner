const { updateDNSProvider } = require('../../../Business/services/selectProviderService.js');

module.exports = {
    name: 'provdns',
    description: 'Configura el proveedor de DNS.',
    execute(rl) {
        return new Promise(resolve => {
            console.log("🔧 Elegí un proveedor DNS:");
            console.log("1️  GoogleDNS");
            console.log("2  CloudflareDNS");
            console.log("3  WavenetDNS");
            rl.question("➡️ Ingresá el número de la opción: ", (input) => {
                updateDNSProvider(input.trim());
                resolve();
            });
        });
    }
};