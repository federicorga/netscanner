
const { getDomainWhois } = require('../../../Business/services/whoisService.js');
const { formatMessage} = require('../systemCommands.js');
const { createTable } = require('../tableFormat.js');


module.exports = {
    name: 'whois',
    description: 'Realiza una consulta WHOIS a una [IP o dominio]. Usa -f para obtener registro completa.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese (Dominio o IP) para una consulta WHOIS❓: ")), async (dominio) => {
                try {
                    
                    const result = await getDomainWhois(dominio.trim());
                  createTable([result.filedsWhois], "Registro WHOIS");
                  
                } catch (err) {
                     console.error(`${formatMessage("error", err.message)} `)
                }
                resolve();
            });
        });
    }
};