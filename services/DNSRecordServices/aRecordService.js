
const { getRegister } = require("../../src/clients/api/DNSClient.js");
const { isCompanyIP } = require("../../utils/utils.js");

async function getARecord(dominio) {
    try {
    
        const data = await getRegister(dominio,"A");
        
        const ip=data.Answer[0].data;

        
        if (data.Answer) {
            console.log(`\n✅ ${dominio} tiene registros A:`, data.Answer);
            if(isCompanyIP(ip)){
                console.log(`\n🛰️✅ El dominio ${dominio} está gestionado por Wavenet.`);
            }else{
                console.log(`\n🛰️❌ El dominio ${dominio} no parece estar gestionado por Wavenet.`);
            }
            return true;
        } else {
            console.log(`\n❌ ${dominio} no tiene registros A.`);
            return false;
        }
    } catch (error) {
        console.error(`\n❗ [Error] al consultar los registros A para ${dominio}:`, error);
        return false;
    }
  };


  module.exports = { getARecord};
  