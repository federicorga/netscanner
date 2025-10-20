const { getBannersFromInput } = require('../../../Business/services/grabBannerService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    name: 'banner',
    description: 'Devuelve el banner de un servicio (Mensaje de bienvenida).',
    execute(rl) {
        return new Promise(resolve => {
            rl.question((formatMessage("request","\nIngrese [IP o Dominio][puerto(s)] para la búsqueda de banner 📓: ")), async (dominio) => {
                await getBannersFromInput(dominio.trim());
                resolve();
            });
        });
    }
};