const { SSLService } = require('../../../Business/services/SSLService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    
    name: 'ssl',
    description: 'Devuelve el certificado SSL de un [Dominio].',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de certificado SSL 🔏​​: ")), async (dominio) => {
                try {
                    
                    const stdout = process.stdout; // Limpiamos la línea de salida
                    stdout.write("⏳ Buscando certificados SSL...");
                    const result = await SSLService(dominio.trim());

                    
                stdout.clearLine(0); 
                stdout.cursorTo(0); 

                    console.log(result);

                } catch (err) {
                    console.error(formatMessage("error","No se pudo obtener la información SSL:", err.message || err));
                }
                resolve();
            });
        });
    }
};