const { DMARCRecordService } = require('../services/DNSRecordServices/DMARCRecordService.js');

module.exports = {
    name: 'dmarc',
    description: 'Busca los registros DMARC de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de registros DMARC 📧🔐: ", async (dominio) => {
                try {
                    await DMARCRecordService(dominio.trim());
                } catch (err) {
                    console.error("❗ [Error] al obtener el registro DMARC:", err);
                }
                resolve();
            });
        });
    }
};