const { scanServerService } = require('../../../Business/services/scanServerService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');
const { createHorizontalTable } = require('../tableFormat.js');

module.exports = {
    name: 'infos',
    description: 'Obtiene información del servidor asociado a una IP o dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [IP o Dominio] para devolver la información del servidor asociado 🖥️: ")), async (dominio) => {
                try {
                const stdout = process.stdout; 
                stdout.write("⏳ Analizando servidor...");
                const result= await scanServerService(dominio.trim());
   
                stdout.clearLine(0);
                stdout.cursorTo(0);  

                console.log(result);
               // createHorizontalTable(result, "Información del Servidor 🖥️");
              
                } catch (err) {
                  console.error(`${formatMessage("error", err.message)} `)
                }
                resolve();
            });
        });
    }
};