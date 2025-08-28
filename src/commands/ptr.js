const { getPtrRecord } = require('../services/DNSRecordServices/ptrRecordService.js');

module.exports = {
    name: 'ptr',
    description: 'Busca el registro PTR de una IP.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question("\n🔎 Ingrese (Dominio o IP) para la búsqueda de Dominio asociado PTR 🔁: ", async (dominio) => {
                try {
                    const ptr = await getPtrRecord(dominio.trim());
                    console.log(ptr);
                } catch (err) {
                    console.error("❗ [Error] al obtener el registro PTR:", err);
                }
                resolve();
            });
        });
    }
};