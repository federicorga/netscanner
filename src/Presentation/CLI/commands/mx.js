const { getMxRecord, tracerMxMailServiceProvider } = require('../../../Business/services/DNSRecordServices/mxRecordService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    name: 'mx',
    description: 'Devuelve los registros MX de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros MX 📧: ")), async (dominio) => {
                try {
                    const result = await getMxRecord(dominio.trim());
                    if (result) await tracerMxMailServiceProvider(dominio.trim());
                    console.log('Registro MX:');
                    console.table(result.data)
                } catch (err) {
                    console.error("❗ [Error] al obtener el registro MX:", err);
                }
                resolve();
            });
        });
    }
};