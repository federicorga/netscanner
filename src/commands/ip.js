const { formatMessage} = require("../utils/systemCommands.js");
const { getIp } = require("../utils/utils.js");

module.exports = {
    name: 'ip',
    description: 'Obtiene la IP de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de IP 📍: ")), async (dominio) => {
                try {
                    const IP = await getIp(dominio.trim());
                    console.log("\nIP:", IP);
                } catch (err) {
                    console.error("❗ [Error] al obtener la IP:", err);
                }
                resolve();
            });
        });
    }
};