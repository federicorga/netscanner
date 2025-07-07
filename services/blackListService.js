const dns = require('dns').promises;

const blacklists = [
  'zen.spamhaus.org',
  'bl.spamcop.net',
  'b.barracudacentral.org',
  'dnsbl.sorbs.net',
  'cbl.abuseat.org',
  'psbl.surriel.com',
  'spam.dnsbl.sorbs.net',
  'ubl.unsubscore.com',
  'all.spamrats.com',
  'dnsbl-1.uceprotect.net',
  'dnsbl-2.uceprotect.net',
  'dnsbl-3.uceprotect.net',
  'combined.rbl.msrbl.net',
];

function interpretarRespuesta(respuesta) {
  if (respuesta.includes('127.0.0.2')) {
    return 'LISTADO - Spam o abuso reportado';
  } else if (respuesta.includes('127.255.255.254')) {
    return 'LISTADO - Bloqueo especial ';
  } else {
    return `Respuesta no estándar: ${respuesta}`;
  }
}

async function arrayBlacklist(ip) {



  console.log(`🔎 Verificando IP: ${ip}...\n`);
  const reversedIp = ip.split('.').reverse().join('.');
  const resultados = [];

  for (const bl of blacklists) {
    const query = `${reversedIp}.${bl}`;
    try {
      const res = await dns.resolve4(query);
      resultados.push({
        blacklist: bl,
        listed: true,
        response: res[0],
        description: interpretarRespuesta(res[0]),
      });
    } catch (err) {
      if (err.code === 'ENOTFOUND') {
        resultados.push({
          blacklist: bl,
          listed: false,
          response: null,
          description: 'No listado',
        });
      } else {
        resultados.push({
          blacklist: bl,
          listed: null,
          response: null,
          description: `Error: ${err.message}`,
        });
      }
    }
  }

  return resultados;
}

async function checkBlacklist(ip){

  const resultados = await arrayBlacklist(ip);

  resultados.forEach(r => {
    if (r.listed === true) {
      console.log(`❌ LISTADO en ${r.blacklist} → ${r.description}`);
    } else if (r.listed === false) {
      console.log(`✅ No listado en ${r.blacklist}`);
    } else {
      console.log(`⚠️ Error en ${r.blacklist} → ${r.description}`);
    }
  });


}

module.exports = { checkBlacklist };
