const { getIp } = require("../../../Infrastructure/network/dnsAdapter.js");
const { formatMessage} = require("../../../Presentation/CLI/systemCommands.js");


module.exports = {
    name: 'ip',
    description: 'Obtiene la IP de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de IP 📍: ")), async (dominio) => {
                try {
                    
                    const result = await getIp(dominio.trim());
                    console.log("\n📍IP:", result);
                } catch (err) {
                   console.error(`${formatMessage("error", err.message)} `)
                }
                resolve();
            });
        });
    }
};