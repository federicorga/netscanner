const { isCompanyIP } = require('../../../utils/utils.js');
const { companyName } = require('../../../Infrastructure/config/config.js');
const { formatMessage} = require('../systemCommands.js');



module.exports = {
    name: `ip${companyName}`,
    description: `Verifica si una [IP] pertenece a ${companyName}.`,
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",(`🔎 Ingrese [IP] para verificar si pertenece a ${companyName} 🏠: `)), async (ip) => {
                try {
                    isCompanyIP(ip.trim())
                        ? console.log(`✅ La IP pertenece a ${companyName}`)
                        : console.log(`❌ La IP no pertenece a ${companyName}`);
                } catch (err) {
                  console.error(`${formatMessage("error", err.message)} `)
                }
                resolve();
            });
        });
    }
};