const { mxLookupService } = require('../../../Business/services/DNSRecordServices/mxRecordService.js');
const { formatMessage, printHostingCheckMessage} = require('../../../Presentation/CLI/systemCommands.js');
const { createHorizontalTable } = require('../tableFormat.js');

module.exports = {
    name: 'mx',
    description: 'Devuelve los registros MX de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros MX 📧: ")), async (dominio) => {
                try {
                    
                    const result = await mxLookupService(dominio.trim());

                      if( result.success===false) {
          
                console.log(formatMessage("not_found", result.message)); //No se encontro registro A
                }
                  
                   if(result.data && result.data.length >0){
                  
                    console.log(formatMessage("success", result.meta.baseMessage));
                    createHorizontalTable(result.data,"Registro MX ✉️:")
            
                        
                
                   
                    for (const step of result.meta.mxTrace.trace) {
                        console.log(step.message);

                    }
                    printHostingCheckMessage(result.meta.mxTrace);
                }
                } catch (err) {
                    `${formatMessage("error", err.message)} `
                }
                resolve();
            });
        });
    }
};