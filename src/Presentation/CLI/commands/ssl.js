const { pruebaSSL } = require('../../../Business/services/SSLService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    
    name: 'ssl',
    description: 'Devuelve el certificado SSL de un [Dominio].',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de certificado SSL 🔏​​: ")), async (dominio) => {
                try {
                    const ssl = await pruebaSSL(dominio.trim());
                    console.log(ssl);
                } catch (err) {
                    console.error("❗ [Error] al obtener la información SSL:", err.message || err);
                }
                resolve();
            });
        });
    }
};