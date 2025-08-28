const { pingHost } = require('../services/pingService.js');

module.exports = {
    name: 'ping',
    description: 'Hace ping a una IP o dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question("\n🔎 Ingrese (IP o Dominio) para hacer ping 📶: ", async (dominio) => {
                try {
                    const resultado = await pingHost(dominio.trim());
                    console.log(resultado);
                } catch (err) {
                    console.error("❗ [Error] al hacer ping:", err);
                }
                resolve();
            });
        });
    }
};