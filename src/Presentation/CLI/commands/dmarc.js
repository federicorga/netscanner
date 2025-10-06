const { DMARCRecordService } = require('../../../Business/services/DNSRecordServices/DMARCRecordService.js');
const { formatMessage, consoleStyles} = require('../../../Presentation/CLI/systemCommands.js');
const Table = require('cli-table3'); // <-- importamos cli-table3
const { createHorizontalTable, createTable } = require('../tableFormat.js');

module.exports = {
    name: 'dmarc',
    description: 'Devuelve los registros DMARC de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros DMARC 📧🔐: ")), async (dominio) => {
                try {
                   const result= await DMARCRecordService(dominio.trim());
                   
                     console.log('\n' + result.message + '\n');
                   
                  
                     createHorizontalTable(result.data, "Registro DMARC 🔐",60,{ Campo:consoleStyles.text.magenta,Descripcion:consoleStyles.text.lightgray});

                     

            

                } catch (err) {
                    console.error("❗ [Error] al obtener el registro DMARC:", err);
                }
                resolve();
            });
        });
    }
};