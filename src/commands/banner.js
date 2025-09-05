const { getBannersFromInput } = require('../utils/grabBanner.js');
const { formatMessage} = require('../utils/systemCommands.js');

module.exports = {
    name: 'banner',
    description: 'Devuelve el banner de un servicio (Mensaje de bienvenida).',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(("\n🔎 Ingrese [IP o Dominio][puerto(s)] para la búsqueda de banner 📓: "), async (dominio) => {
                await getBannersFromInput(dominio.trim());
                resolve();
            });
        });
    }
};