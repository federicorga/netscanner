const { checkDNSHealth } = require("../../../Infrastructure/repository/clients/api/DNSClient.js");
const { formatMessage} = require("../../../Presentation/CLI/systemCommands.js");



module.exports = {
    name: 'checkdns',
    
    description: 'Verifica el estado de un servidor DNS.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese la [IP] del servidor DNS a chequear si esta activo 🖧: ")), async (dnsIP) => {
                try {
                    const isHealthy = await checkDNSHealth(dnsIP.trim(), "example.com", "A");
                    if (isHealthy) {
                        console.log("✅ El servidor DNS está operativo.");
                    } else {
                        console.log("❌ El servidor DNS NO responde. Puede que la IP ingresada no sea un servidor DNS válido o configurado.");
                    }
                } catch (err) {
                    console.error("❗ [Error] al chequear el servidor DNS:", err);
                }
                resolve();
            });
        });
    }
};