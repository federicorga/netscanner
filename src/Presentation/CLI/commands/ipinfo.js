const { getIpInfo} = require('../../../Infrastructure/repository/clients/api/ipInfoClient.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    name: 'ipinfo',
    description: 'Devuelve la información de IPINFO de una [IP o dominio].',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [IP o Dominio], para devolver informacion completa desde ipinfo ℹ️​​: ")), async (dominio) => {
                try {
                    const result = await getIpInfo(dominio.trim());
                    mostrarIpInfo(result);
                } catch (err) {
                    console.error(`${formatMessage("error", err.message)} `)
                }
                resolve();
            });
        });
    }
};


function mostrarIpInfo(data) {
  console.log(`\n🆔 Información de IPinfo:\n`);
  console.log(`🌐 IP: ${data.ip}`);
  console.log(`🏢 Organización ISP: ${data.org}`);
  console.log(`💻 Hostname: ${data.hostname}`);
  console.log(`📍 Ciudad: ${data.city}`);
  console.log(`🗺️ Región: ${data.region}`);
  console.log(`🌍 País: ${data.country}`);
  console.log(`📌 Coordenadas: ${data.loc}`);
  console.log(`🏤 Código Postal: ${data.postal}`);
  console.log(`🗺️ Mapa: https://www.google.com/maps?q=${data.loc}\n`);
}
