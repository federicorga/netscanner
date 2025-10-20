const { getRegister } = require('../../../Infrastructure/repository/clients/api/DNSClient');
const { normalizeToArray } = require('../../../utils/utils');




// Busca un registro DKIM usando un selector
async function getDKIMRecord(domain, selector) {

  const dkimDomain = `${selector}._domainkey.${domain}`;
  try {
    const raw = await getRegister(dkimDomain, 'TXT');

    if (!raw.success) {
      return raw
      }

    const records = await normalizeToArray(raw.data.Answer);

   return {
            success: raw.success,
            message: `DKIM encontrado para "${domain}" con selector "${selector}.`,
            data: records,
            error: null
   }
  } catch (err) {
    return {
            success: false,
            message: `No se pudo consultar el registro DKIM para el dominio: ${domain}`,
            data: null,
            error: err.message
        };
  }
};


async function findDKIMSelector(domain) {
  const selectors = ['default', 'selector1', 'selector2', 'google', 'zoho', 'mandrill', 'k1', 's1', 'dkim'];

  for (const selector of selectors) {

  const record = await getDKIMRecord(domain, selector);
  
    if (record.success) {
      return record
    }
  }

  return null;
};



function parseDKIM(txtArray) {// Convierte un TXT DKIM en objeto {clave: valor}
  // txtArray es un array de arrays: [ [ 'v=DKIM1; k=rsa; p=...' ] ]
  const joined = txtArray
    .map(part => Array.isArray(part) ? part.join('') : part) // <-- FIX // unimos todo en un string
    .join('');

  const entries = joined.split(';').map(e => e.trim()).filter(Boolean); // separar por ;

  const obj = {};
  for (const entry of entries) {
    const [key, ...rest] = entry.split('=');
    if (key && rest.length > 0) {
      obj[key.trim()] = rest.join('=').trim();// por si hay = en el valor
    }
  }
  return obj;
}


// Servicio para analizar y devolver los datos de DKIM
async function DKIMLookupService(domain) {

  const result = await findDKIMSelector(domain);

  if (!result.success) {
    return result 
}
console.log(result)
const objectDKIM=parseDKIM(result.data); // Convierte el TXT DKIM en un objeto {clave: valor}

  return {
    ...result,
    data: objectDKIM,
  };
}

module.exports = { DKIMLookupService };