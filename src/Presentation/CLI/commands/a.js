const Table = require("cli-table3");
const {
  getARecord,
  aLookupService,
} = require("../../../Business/services/DNSRecordServices/aRecordService.js");
const { formatMessage, consoleStyles } = require("../../../Presentation/CLI/systemCommands.js");

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
          
              console.log(formatMessage("not_found", result.message));}
         
           
            if (result.data && result.data.length > 0) {
              console.log(formatMessage("success", result.meta.baseMessage));
              // Creamos una tabla por cada registro
              result.data.forEach((record, index) => {
                const table = new Table({
                  head: ["Field", "Value"],
                  colWidths: [10, 40],
                  wordWrap: true,
                  style: { head: ["cyan"], border: ["grey"] },
                });

                Object.entries(record).forEach(([key, value]) => {
                  table.push([key, consoleStyles.text.green + value]);
                });

                const icon= result.success.esWavenet ?"🛰️ ✅ " : "🛰️ ❌ ";;

                console.log(`\nRegistro A 🌐 #${index + 1}:\n`);
                console.log(table.toString());
                console.log("\n" + icon + result.message+ "\n");
              });
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
 