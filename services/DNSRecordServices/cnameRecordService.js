const { getRegister } = require("../../src/clients/api/DNSClient");


async function getCnameRecord(dominio) {
    try {
        
        const data = await getRegister(dominio, "CNAME");
  
        if (data.Answer) {
            console.log(`\n✅ ${dominio} tiene registros CNAME:`, data.Answer);
            return true;
        } else {
            console.log(`\n❌ No se encontro registro CNAME para el dominio: ${dominio}`);
            return false;
        }
    } catch (error) {
        console.error(`\n❗[Error] al consultar los registros CNAME para ${dominio}:`, error);
        return false;
    }
  };


  module.exports = { getCnameRecord };


  