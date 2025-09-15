const { getTXTRecords } = require('../../../Business/services/DNSRecordServices/txtRecordService.js');
const { formatMessage } = require('../systemCommands.js');

const {createTable } = require('../tableFormat.js');


module.exports = {
    name: 'txt',
    description: 'Devuelve los registros TXT de un [Dominio].',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros TXT 📜: ")), async (dominio) => {
                try {
                   const result= await getTXTRecords(dominio.trim());

                   if (result.data && result.data.length > 0) {
              console.log(formatMessage("success", result.meta.baseMessage));
                createTable(result.data, 50);  
                        // Mostrar la tabla en la consola
            }

                } catch (err) {
                    console.error("❗ [Error] al obtener los registros TXT:", err);
                }
                resolve();
            });
        });
    }
};