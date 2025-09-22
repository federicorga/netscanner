const { getMxRecord, tracerMxMailServiceProvider } = require('../../../Business/services/DNSRecordServices/mxRecordService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');
const { createHorizontalTable } = require('../tableFormat.js');

module.exports = {
    name: 'mx',
    description: 'Devuelve los registros MX de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros MX 📧: ")), async (dominio) => {
                try {
                    const result = await getMxRecord(dominio.trim());
                  
                   
                    createHorizontalTable(result.data,"Registro MX ✉️:")
                    if (result) 
                        
                        mxTrace= await tracerMxMailServiceProvider(dominio.trim());

                    for (const step of mxTrace.trace) {
                        console.log(step.message);}
                } catch (err) {
                    console.error("❗ [Error] al obtener el registro MX:", err);
                }
                resolve();
            });
        });
    }
};