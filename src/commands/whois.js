const { getDomainOwner } = require('../services/whoisService.js');

module.exports = {
    name: 'whois',
    description: 'Realiza una consulta WHOIS a una IP o dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question("\n🔎 Ingrese (Dominio o IP) para una consulta WHOIS❓: ", async (dominio) => {
                try {
                    const whois = await getDomainOwner(dominio.trim());
                    console.log('\nRegistro Whois:', whois.filedsWhois);
                } catch (err) {
                    console.error("❗ [Error] al obtener el registro WHOIS:", err);
                }
                resolve();
            });
        });
    }
};