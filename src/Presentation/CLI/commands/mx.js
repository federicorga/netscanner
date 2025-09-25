const { getMxRecord, tracerMxMailServiceProvider, mxLookupService } = require('../../../Business/services/DNSRecordServices/mxRecordService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');
const { createHorizontalTable } = require('../tableFormat.js');

module.exports = {
    name: 'mx',
    description: 'Devuelve los registros MX de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros MX 📧: ")), async (dominio) => {
                try {
                    const result = await mxLookupService(dominio.trim());
                  
                    if( result.mxRecord.success===false) {
                       
                        console.log(formatMessage("not_found", result.mxRecord.message)); //No se encontro registro A
                      }
                    createHorizontalTable(result.mxRecord.data,"Registro MX ✉️:")
            if (result.mxRecord.data && result.mxRecord.data.length > 0) 
                   

                        console.log(formatMessage("success", result.mxRecord.meta.baseMessage));
                    for (const step of result.mxTracer.trace) {
                        console.log(`${step.message}`);}
                } catch (err) {
                    `${formatMessage("error", err.message)} `
                }
                resolve();
            });
        });
    }
};