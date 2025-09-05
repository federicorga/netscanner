const { getARecord } = require('../services/DNSRecordServices/aRecordService.js');
const { formatMessage} = require('../utils/systemCommands.js');

module.exports = {
    name: 'a',
    description: 'Devuelve los registros A de un [Dominio].',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros A 🌐🔗📍: ")), async (dominio) => {
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