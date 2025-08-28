const { checkBlacklist } = require('../services/blackListService.js');

module.exports = {
    name: 'blacklist',
    description: 'Verifica si una IP está en una blacklist.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question("\n🔎 Ingrese (IP) para la búsqueda en blacklist 📓 : ", async (dominio) => {
                try {
                    await checkBlacklist(dominio.trim());
                } catch (err) {
                    console.error("❗ [Error] al verificar la blacklist:", err);
                }
                resolve();
            });
        });
    }
};