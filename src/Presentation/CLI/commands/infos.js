const { scanServerInfo } = require('../../../Business/services/scanServerService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');
const { createHorizontalTable } = require('../tableFormat.js');

module.exports = {
    name: 'infos',
    description: 'Obtiene información del servidor asociado a una IP o dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [IP o Dominio] para devolver la información del servidor asociado 🖥️: ")), async (dominio) => {
                try {
                    const result= await scanServerInfo(dominio.trim());
                    createHorizontalTable(result, "Información del Servidor 🖥️");
              
                } catch (err) {
                  console.error(`${formatMessage("error", err.message)} `)
                }
                resolve();
            });
        });
    }
};