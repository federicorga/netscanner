const { companyName } = require("../../config/config.js");
const { getRegister } = require("../../src/clients/api/DNSClient.js");
const { isCompanyIP } = require("../../utils/utils.js");

async function getARecord(dominio) {
    try {
        const data = await getRegister(dominio, "A");

        if (data.Answer && data.Answer.length > 0) {
            let esWavenet = false;
            console.log(`\n✅ ${dominio} tiene registros A:`, data.Answer);

            for (const record of data.Answer) { // Iteramos sobre los registros A
                const ip = record.data || record.address; // Obtenemos la IP del registro
                if (ip && isCompanyIP(ip)) {
                    esWavenet = true;
                    break;
                }
            }

            if (esWavenet) {
                console.log(`\n🛰️✅ El dominio ${dominio} tiene alojado su servicio o recurso en ${companyName}.`);
            } else {
                console.log(`\n🛰️❌ El dominio ${dominio} no parece tener alojado su servicio o recurso en ${companyName}.`);
            }
            return true;
        } else {
            console.log(`\n❌ No se encontró registro A para el dominio: ${dominio}.`);
            return false;
        }
    } catch (error) {
        console.error(`\n❗ [Error] al consultar los registros A para ${dominio}:`, error);
        return false;
    }
};

module.exports = { getARecord };