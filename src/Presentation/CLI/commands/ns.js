const {nsLookupService } = require('../../../Business/services/DNSRecordServices/nsRecordService.js');
const { whoisService } = require('../../../Business/services/whoisService.js');
const { formatMessage,printHostingCheckMessage} = require('../../../Presentation/CLI/systemCommands.js');
const { createTable, createHorizontalTable } = require('../tableFormat.js');


module.exports = {
    name: 'ns',
    description: `Devuelve los registros NS de un dominio.`,
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros NS 🏢: ")), async (dominio) => {
                try {
                    const result = await nsLookupService(dominio.trim());

                    if(result.success===false) {
                        
                        console.log(formatMessage("not_found", result.message)); //No se encontro registro NS
                    }

                    if(result.data && result.data.length >0){
                  
                    console.log(formatMessage("success", result.meta.baseMessage));

                    createHorizontalTable(result.data,"Registro NS 🖥️:");
                    printHostingCheckMessage(result);
         
                   
                    if(!result.success.isCompany){  
                        console.log(`\n🔍 Entidad que gestiona el dominio: \n`);
                        
                        const WhoisInfo= await whoisService(dominio.trim());
                        createTable([WhoisInfo.filedsWhois], "Información WHOIS❓");
                    }
                    
                    
                }
                
                } catch (err) {
                     console.error(
              `${formatMessage("error", err.message)} `,);
                }
                resolve();
            });
        });
    }
};