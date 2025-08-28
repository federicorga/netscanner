const { DKIMLookupService } = require('../services/DNSRecordServices/DKIMRecordService.js');

module.exports = {
    name: 'dkim',
    description: 'Busca los registros DKIM de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de registros DKIM 📬🛡️: ", async (dominio) => {
                try {
                    await DKIMLookupService(dominio.trim());
                } catch (err) {
                    console.error("❗ [Error] al obtener el registro DKIM:", err);
                }
                resolve();
            });
        });
    }
};