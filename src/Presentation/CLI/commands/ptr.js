const { getPtrRecord } = require('../../../Business/services/DNSRecordServices/ptrRecordService.js');
const { formatMessage} = require('../../CLI/systemCommands.js');

module.exports = {
    name: 'ptr',
    description: 'Devuelve el registro PTR de una [IP].',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio o IP] para la búsqueda de Dominio asociado PTR 🔁: ")), async (dominio) => {
                try {
                    const result = await getPtrRecord(dominio.trim());
                    console.log(result);
                } catch (err) {
                   console.error(`${formatMessage("error", err.message)} `)
                }
                resolve();
            });
        });
    }
};