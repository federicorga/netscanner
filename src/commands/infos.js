const { scanServerInfo } = require('../services/scanServerService.js');

module.exports = {
    name: 'infos',
    description: 'Obtiene información del servidor asociado a una IP o dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question("\n🔎 Ingrese (IP o Dominio) para devolver la información del servidor asociado 🖥️: ", async (dominio) => {
                try {
                    await scanServerInfo(dominio.trim());
                } catch (err) {
                    console.error("❗ [Error] al obtener la información del servidor:", err);
                }
                resolve();
            });
        });
    }
};