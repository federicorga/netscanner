const { getCnameRecord } = require('../services/DNSRecordServices/cnameRecordService.js');

module.exports = {
    name: 'cname',
    description: 'Busca los registros CNAME de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de registros CNAME 🔀: ", async (dominio) => {
                try {
                    await getCnameRecord(dominio.trim());
                } catch (err) {
                    console.error("❗ [Error] al obtener el registro CNAME:", err);
                }
                resolve();
            });
        });
    }
};