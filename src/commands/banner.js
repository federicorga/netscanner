const { getBannersFromInput } = require('../utils/grabBanner.js');

module.exports = {
    name: 'banner',
    description: 'Obtiene el banner de un servicio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question("\n🔎 Ingrese IP o dominio y puerto(s) para la búsqueda de banner 📓: ", async (dominio) => {
                await getBannersFromInput(dominio.trim());
                resolve();
            });
        });
    }
};