const { getIpInfo, mostrarIpInfo } = require('../../../Infrastructure/repository/clients/api/ipInfoClient.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');

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
                    console.error(`${formatMessage("error", err.message)} `)
                }
                resolve();
            });
        });
    }
};