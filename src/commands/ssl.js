const { pruebaSSL } = require('../services/SSLService.js');

module.exports = {
    name: 'ssl',
    description: 'Verifica el certificado SSL de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de certificado SSL 🔏​​: ", async (dominio) => {
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