const { DMARCRecordService } = require('../../../Business/services/DNSRecordServices/DMARCRecordService.js');
const { formatMessage, consoleStyles} = require('../../../Presentation/CLI/systemCommands.js');
const { createHorizontalTable} = require('../tableFormat.js');

module.exports = {
    name: 'dmarc',
    description: 'Devuelve los registros DMARC de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros DMARC 📧🔐: ")), async (dominio) => {
                try {
                   const result= await DMARCRecordService(dominio.trim());
                   
                     console.log('\n' + result.message + '\n');
                   
                  
                     createHorizontalTable(result.data, "Registro DMARC 🔐",55,{ Campo:consoleStyles.text.magenta,Descripcion:consoleStyles.text.lightgray});

                     

            

                } catch (err) {
                     console.error(`${formatMessage("error", err.message)} `)
                }
                resolve();
            });
        });
    }
};