const { parse } = require('path');

const dns = require('dns').promises;


// Busca un registro DKIM usando un selector
async function getDKIMRecord(domain, selector) {
  const dkimDomain = `${selector}._domainkey.${domain}`;
  try {
    const record = await dns.resolveTxt(dkimDomain);

    if(!record){
         return {
            success: false,
            message: `No se encontró registro DKIM para el dominio: ${domain}`,
            data: null,
            error:  { code: 404, detail: 'Registro DKIM no existe' }
   }
    }
   return {
            success: true,
            message: `DKIM encontrado para "${domain}" con selector "${selector}.`,
            data: record,
            error: null
   }
  } catch (err) {
    return {
            success: false,
            message: `No se pudo consultar el registro DKIM para el dominio: ${domain}`,
            data: null,
            error: { code: 500, detail: err.message }
        };
  }
};


async function findDKIMSelector(domain) {
  const selectors = ['default', 'selector1', 'selector2', 'google', 'zoho', 'mandrill', 'k1', 's1', 'dkim'];

  for (const selector of selectors) {
    const record = await getDKIMRecord(domain, selector);
    if (record) {
      return {
      success: record.success,
      message: record.message,
      data: record.data,
      error: record.error
      };
    }
  }

  return null;
};




function parseDKIM(txtArray) { // Convierte un TXT DKIM en objeto {clave: valor}
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

  const raw = await findDKIMSelector(domain);



  const objectDKIM= parseDKIM(raw.data); // Convierte el TXT DKIM en un objeto {clave: valor}

  return {
    success: raw.success,
    message: raw.message,
    data: objectDKIM,
    error:raw.error
  };
}

module.exports = { DKIMLookupService };