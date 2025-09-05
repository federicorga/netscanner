const Table = require('cli-table3');
const { DKIMLookupService } = require('../services/DNSRecordServices/DKIMRecordService.js');
const { formatMessage} = require('../utils/systemCommands.js');

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
            console.log(`\nv: Versión del protocolo DKIM, siempre DKIM1.\nk: Algoritmo de clave pública (normalmente "rsa").\np: Clave pública codificada en base64.\n`)
           console.log(`Registro DKIM:\n`);
                  const table = new Table({
              head: ['Campo', 'Valor'],
                colWidths: [10, 100], // max ancho para "Valor"
               wordWrap: true,       // hace wrap automático si excede
              style: { head: ['cyan'], border: ['grey'] }
            });

            Object.entries(result.data).forEach(([key, value]) => {
              table.push([key, value]);
            });

            console.log(table.toString());
            console.log('\n🔐 Clave "p" completa :\n', result.data.p);
          }

        } catch (err) {
          console.error("❗ [Error] al obtener el registro DKIM:", err);
        }
        resolve();
      });
    });
  }
};
