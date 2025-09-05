const { parse } = require('path');

const dns = require('dns').promises;


// Busca un registro DKIM usando un selector
async function getDKIMRecord(domain, selector) {
  const dkimDomain = `${selector}._domainkey.${domain}`;
  try {
    const records = await dns.resolveTxt(dkimDomain);
    return records;
  } catch (err) {
    return null;
  }
};

// Prueba con selectores comunes para encontrar el DKIM
async function findDKIMSelector(domain) {
  const selectors = ['default', 'selector1', 'selector2', 'google', 'zoho', 'mandrill', 'k1', 's1', 'dkim'];

  for (const selector of selectors) {
    const record = await getDKIMRecord(domain, selector);
    if (record) {
      return {
        selector,
        dkim: record
      };
    }
  }

  return null;
};



// Convierte un TXT DKIM en objeto {clave: valor}
function parseDKIMTXT(txtArray) {
  // txtArray es un array de arrays: [ [ 'v=DKIM1; k=rsa; p=...' ] ]
  const joined = txtArray.map(part => part.join('')).join(''); // unimos todo en un string
  const entries = joined.split(';').map(e => e.trim()).filter(Boolean); // separar por ;
  const obj = {};
  for (const entry of entries) {
    const [key, ...rest] = entry.split('=');
    if (key && rest.length > 0) {
      obj[key.trim()] = rest.join('=').trim(); // por si hay = en el valor
    }
  }
  return obj;
}




// Servicio para analizar y devolver los datos de DKIM
async function DKIMLookupService(domain) {
  const result = await findDKIMSelector(domain);

  if (!result) {
    return {
      success: false,
      message: `No se encontró un registro DKIM para "${domain}" con los selectores comunes.`,
      data: null,
    };
  }

  const objectDKIM= parseDKIMTXT(result.dkim)

  return {
    success: true,
    message: `DKIM encontrado para "${domain}" con selector "${result.selector}".`,
    data: objectDKIM, // Devuelve el registro DKIM como objeto {v, k, p, ...
  };
}

module.exports = { DKIMLookupService };