const { checkBlacklist } = require('../../../Business/services/blackListService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    name: 'blacklist',
    description: 'Verifica si una [IP] está en una blacklist.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [IP] para la búsqueda en blacklist 📓 : ")), async (dominio) => {
                try {
                    await checkBlacklist(dominio.trim());
                } catch (err) {
                   console.error(`${formatMessage("error", err.message)} `)
                }
                resolve();
            });
        });
    }
};