const { getRegister } = require("../../src/clients/api/DNSClient");


async function getTXTRecords(domain) { // Función para obtener registros TXT de un dominio
  try {

    const data = await getRegister(domain, "TXT");


    console.log("Registros TXT:\n", data.Answer);
  } catch (error) {

    console.error("❗[Error] al obtener los registros TXT:", error);
  }
}

module.exports = { getTXTRecords };