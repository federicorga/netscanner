const { getCnameRecord } = require('../services/DNSRecordServices/cnameRecordService.js');
const { formatMessage} = require('../utils/systemCommands.js');

module.exports = {
    name: 'cname',
    description: 'Devuelve los registros CNAME de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros CNAME 🔀: ")), async (dominio) => {
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