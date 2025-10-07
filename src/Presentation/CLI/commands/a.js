
const {aLookupService} = require("../../../Business/services/DNSRecordServices/aRecordService.js");
const { formatMessage,printHostingCheckMessage } = require("../../../Presentation/CLI/systemCommands.js");
const { createHorizontalTable } = require("../tableFormat.js");


module.exports = {
  name: "a",
  description: "Devuelve los registros A de un [Dominio].",
  execute(rl) {
    return new Promise((resolve) => {
      rl.question(
        formatMessage(
          "request",
          "\n🔎 Ingrese [Dominio] para la búsqueda de registros A 🌐🔗📍: "
        ),
        async (dominio) => {

          try {
    
            const result = await aLookupService(dominio.trim());

            if( result.success===false) {
          
              console.log(formatMessage("not_found", result.message)); //No se encontro registro A
            }
         
           
            if (result.data && result.data.length > 0) {
              console.log(formatMessage("success", result.meta.baseMessage));
              
              createHorizontalTable(result.data,"Registro A 🌐 ")
              printHostingCheckMessage(result);     
           
            }
          
          } catch (err) {
        
            console.error(
              `${formatMessage("error", err.message)} `,
             
            );
          }
          resolve();
        }
      );
    });
  },
};
 