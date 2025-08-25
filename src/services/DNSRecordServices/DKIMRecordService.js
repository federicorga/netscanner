const dns = require('dns').promises;
const chalk = require('chalk');

// Busca un registro DKIM usando un selector
async function getDKIMRecord(domain, selector) {
  const dkimDomain = `${selector}._domainkey.${domain}`;
  try {
    const records = await dns.resolveTxt(dkimDomain);
    const joined = records.map(r => r.join('')).join('');
    return joined;
  } catch (err) {
    return null;
  }
}

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
}

// Servicio para mostrar resultado de búsqueda DKIM
async function DKIMLookupService(domain) {
  const result = await findDKIMSelector(domain);

  if (result) {
    console.log(chalk.green(`✅ DKIM encontrado para ${chalk.cyan(domain)} con selector "${chalk.yellow(result.selector)}":\n`));
  
console.log(`\nv: Versión del protocolo DKIM, siempre DKIM1.\nk: Algoritmo de clave pública (normalmente "rsa").\np: Clave pública codificada en base64.\n`)

console.log(
  result.dkim
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
    .join(';\n') + ';');
    
  } else {
    console.log(chalk.red(`❌ No se encontró un registro DKIM para ${chalk.cyan(domain)} con los selectores comunes.`));
  }
}

module.exports = { DKIMLookupService };
