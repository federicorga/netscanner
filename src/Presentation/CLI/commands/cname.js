const {CNAMELookupService } = require('../../../Business/services/DNSRecordServices/cnameRecordService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');
const { createHorizontalTable } = require('../tableFormat.js');

module.exports = {
    name: 'cname',
    description: 'Devuelve los registros CNAME de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros CNAME 🔀: ")), async (dominio) => {
                try {
                   const result= await CNAMELookupService(dominio.trim());
 if( result.success===false) {
          
              console.log(formatMessage("not_found", result.message));
            }
            if (result.data && result.data.length > 0){
                console.log(formatMessage("success", result.meta.baseMessage));
                   createHorizontalTable(result.data, "Registro CNAME 🔀",55);
            }
               
                    
                } catch (err) {
                    console.error(
              `${formatMessage("error", err.message)} `,
             
            );
                }
                resolve();
            });
        });
    }
};