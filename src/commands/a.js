const { getARecord } = require('../services/DNSRecordServices/aRecordService.js');

module.exports = {
    name: 'a',
    description: 'Busca los registros A de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de registros A 🌐🔗📍: ", async (dominio) => {
                try {
                    const tieneA = await getARecord(dominio.trim());
                    console.log('Registro A:', tieneA);
                } catch (err) {
                    console.error("❗ [Error] al obtener el registro A:", err);
                }
                resolve();
            });
        });
    }
};