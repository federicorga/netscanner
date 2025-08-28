const { getTXTRecords } = require('../services/DNSRecordServices/txtRecordService.js');

module.exports = {
    name: 'txt',
    description: 'Busca los registros TXT de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de registros TXT 📜: ", async (dominio) => {
                try {
                    await getTXTRecords(dominio.trim());
                } catch (err) {
                    console.error("❗ [Error] al obtener los registros TXT:", err);
                }
                resolve();
            });
        });
    }
};