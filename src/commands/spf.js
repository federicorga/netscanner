const { SPFRecordService } = require('../services/DNSRecordServices/SPFRecordService.js');

module.exports = {
    name: 'spf',
    description: 'Busca los registros SPF de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de registros SPF 📬🗄️: ", async (dominio) => {
                try {
                    await SPFRecordService(dominio.trim());
                } catch (err) {
                    console.error("❗ [Error] al obtener el registro SPF:", err);
                }
                resolve();
            });
        });
    }
};