
const net = require("net");
const { getIp } = require("../../utils/utils");

async function getIpInfo(ip) {

      const esIp = net.isIP(ip);
        if (!esIp) {
          ip = await getIp(ip);
        }
  const res = await fetch(`https://ipinfo.io/${ip}/json`);
  const data = await res.json();
  return {
  ip: data.ip,             // 📍 La IP consultada (ej. "45.173.0.50")
  org: data.org,           // 🏢 ISP Organización a la que está asignada la IP (ej. "AS61451 WAVENET S.A.")
  hostname: data.hostname, // 🌐 Nombre de host (DNS inverso) asociado a la IP (ej. "v5.wavenet.com")
  city: data.city,         // 🏙️ Ciudad aproximada desde donde se usa la IP (ej. "Buenos Aires")
  region: data.region,     // 🗺️ Región o provincia (ej. "Buenos Aires F.D.")
  country: data.country,   // 🌍 Código de país (ej. "AR" para Argentina)
  loc: data.loc,           // 📌 Coordenadas geográficas (latitud,longitud) (ej. "-34.6131,-58.3772")
  postal: data.postal      // 🏤 Código postal asociado a la ubicación aproximada (ej. "1871")

  };
}


function mostrarIpInfo(data) {
  console.log(`\n🆔 Información de IP/Dominio - IpInfo:\n`);
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


module.exports = { getIpInfo,mostrarIpInfo };