
const { companyName } = require("../../config/config.js");
const { getRegister } = require("../../src/clients/api/DNSClient.js");

const { isCompanyIP } = require("../../utils/utils.js");

async function getARecord(dominio) {
    try {
    
        const data = await getRegister(dominio,"A");
        
        const ip=data.Answer[0].data;

        
        if (data.Answer) {
            console.log(`\n✅ ${dominio} tiene registros A:`, data.Answer);
            if(isCompanyIP(ip)){
                
                console.log(`\n🛰️✅ El dominio ${dominio} tiene alojado su servicio o recurso en ${companyName}.`);
            }else{
                console.log(`\n🛰️❌ El dominio ${dominio} no parece tener alojado su servicio o recurso en ${companyName}.`);
            }
            return true;
        } else {
            console.log(`\n❌ No se encontro registro A para el dominio: ${dominio}.`);
            return false;
        }
    } catch (error) {
        console.error(`\n❗ [Error] al consultar los registros A para ${dominio}:`, error);
        return false;
    }
  };


  module.exports = { getARecord};
  