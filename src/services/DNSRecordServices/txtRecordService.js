const { getRegister } = require("../../clients/api/DNSClient");


async function getTXTRecords(domain) { // Función para obtener registros TXT de un dominio
  try {

    const data = await getRegister(domain, "TXT");


    console.log("Registros TXT:\n", data.Answer);
  } catch (error) {

     throw error;
  }
}

module.exports = { getTXTRecords };