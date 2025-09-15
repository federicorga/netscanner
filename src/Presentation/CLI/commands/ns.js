const { getNsRecord } = require('../../../Business/services/DNSRecordServices/nsRecordService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    name: 'ns',
    description: `Devuelve los registros NS de un dominio.`,
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros NS 🏢: ")), async (dominio) => {
                try {
                    const tieneNS = await getNsRecord(dominio.trim());
                    console.log('Registro NS:', tieneNS);
                } catch (err) {
                    console.error("❗ [Error] al obtener el registro NS:", err);
                }
                resolve();
            });
        });
    }
};