const { getMxRecord, tracerMxMailServiceProvider } = require('../services/DNSRecordServices/mxRecordService.js');

module.exports = {
    name: 'mx',
    description: 'Busca los registros MX de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de registros MX 📧: ", async (dominio) => {
                try {
                    const tieneMX = await getMxRecord(dominio.trim());
                    if (tieneMX) await tracerMxMailServiceProvider(dominio.trim());
                    console.log('Registro MX:', tieneMX);
                } catch (err) {
                    console.error("❗ [Error] al obtener el registro MX:", err);
                }
                resolve();
            });
        });
    }
};