const { getIpInfo, mostrarIpInfo } = require('../clients/api/ipInfoClient.js');
const { formatMessage} = require('../utils/systemCommands.js');

module.exports = {
    name: 'ipinfo',
    description: 'Devuelve la información de IPINFO de una [IP o dominio].',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [IP o Dominio], para devolver informacion completa desde ipinfo ℹ️​​: ")), async (dominio) => {
                try {
                    const result = await getIpInfo(dominio.trim());
                    mostrarIpInfo(result);
                } catch (err) {
                    console.error("❗ [Error] al obtener información de IP:", err);
                }
                resolve();
            });
        });
    }
};