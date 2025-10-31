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
            ...raw,
            message: `DKIM encontrado para "${domain}" con selector "${selector}.`,
            data: records,
      
   }
  } catch (err) {
    return {
            success: false,
            message: `No se pudo consultar el registro DKIM para el dominio: ${domain}`,
            data: null,
            error: err.message,
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




// Servicio para analizar y devolver los datos de DKIM
async function DKIMLookupService(domain) {

  const result = await findDKIMSelector(domain);

  if (!result.success) {
    return result 
}


  return {
    ...result,
   
  };
}

module.exports = { DKIMLookupService };