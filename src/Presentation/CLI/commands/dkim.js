const { DKIMLookupService } = require('../../../Business/services/DNSRecordServices/DKIMRecordService.js');
const { formatMessage, consoleStyles} = require('../../../Presentation/CLI/systemCommands.js');
const {  createHorizontalTable, createTable } = require('../tableFormat.js');

module.exports = {
  name: 'dkim',
  description: 'Devuelve los registros DKIM de un dominio.',
  execute(rl) {
    return new Promise(resolve => {
      rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros DKIM 📬🛡️: ")), async (dominio) => {
        try {
          const result = await DKIMLookupService(dominio.trim());

          console.log('\n' + result.message + '\n');

          if (result.data) {
            console.log(result.data)
            console.log(`\nv: Versión del protocolo DKIM, siempre DKIM1.\nk: Algoritmo de clave pública (normalmente "rsa").\np: Clave pública codificada en base64.\n`)
    
            createHorizontalTable(result.data, "Registro DKIM 🛡️")

        
            //console.log('\n🔐 Clave "p" completa :\n', result.data[0].p);
          }

        } catch (err) {
          console.error(`${formatMessage("error", err.message)} `)
        }
        resolve();
      });
    });
  }
};
