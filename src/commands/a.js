const Table = require('cli-table3');
const { getARecord, aLookupService } = require('../services/DNSRecordServices/aRecordService.js');
const { formatMessage, consoleStyles} = require('../utils/systemCommands.js');

module.exports = {
    name: 'a',
    description: 'Devuelve los registros A de un [Dominio].',
    execute(rl) {
        
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros A 🌐🔗📍: ")), async (dominio) => {
                try {
                    const result = await aLookupService(dominio.trim());

                 


if (result.data && result.data.length > 0) {
  // Creamos una tabla por cada registro
  result.data.forEach((record, index) => {
    const table = new Table({
      head: ['Field', 'Value'],
      colWidths: [10, 40],
      wordWrap: true,
      style: { head: ['cyan'], border: ['grey'] }
    });

    Object.entries(record).forEach(([key, value]) => {
      table.push([key, consoleStyles.text.green + value]);
    });

    console.log(`\nRegistro A 🌐 #${index + 1}:\n`);
    console.log(table.toString());
  });
}


       console.log('\n' + result.message + '\n');

        
                } catch (err) {
                    console.error("❗ [Error] al obtener el registro A:", err);
                }
                resolve();
            });
        });
    }
};