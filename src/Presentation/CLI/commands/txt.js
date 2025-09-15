const { getTXTRecords } = require('../../../Business/services/DNSRecordServices/txtRecordService.js');
const { formatMessage } = require('../systemCommands.js');


module.exports = {
    name: 'txt',
    description: 'Devuelve los registros TXT de un [Dominio].',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros TXT 📜: ")), async (dominio) => {
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