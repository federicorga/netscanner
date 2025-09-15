const { getCrtShIdFromSHA1 } = require('../../../Business/services/SSLService.js');
const { consoleStyles, consoleControl, formatMessage } = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    name: 'serialssl',
    description: 'Verifica un certificado SSL por su número de serie.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese el serial para verificar si el certificado es válido 🔑: ")), async (serialssl) => {
                try {
                    const resultado = await getCrtShIdFromSHA1(serialssl.trim());
                    console.log(`\n🆔 Número ID de Certificado: ${consoleStyles.text.green} ${resultado} ${consoleControl.resetStyle}`);
                    console.log(`\n🔗 Url del Certificado:${consoleStyles.text.green} https://crt.sh/?q=${resultado}${consoleControl.resetStyle}`);
                } catch (err) {
                    console.error("❗ [Error] al obtener el serial:", err);
                }
                resolve();
            });
        });
    }
};