const { pruebaSSL } = require('../../../Business/services/SSLService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    
    name: 'ssl',
    description: 'Devuelve el certificado SSL de un [Dominio].',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de certificado SSL 🔏​​: ")), async (dominio) => {
                try {
                    const result = await pruebaSSL(dominio.trim());
                    console.log(result);
                } catch (err) {
                    console.error(formatMessage("error","No se pudo obtener la información SSL:", err.message || err));
                }
                resolve();
            });
        });
    }
};