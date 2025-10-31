const whois = require('whois-json');


async function getRawWhois(domain) { // Función para obtener el WHOIS crudo
    const data = await whois(domain); // Obtener datos WHOIS en formato JSON
    return data;
            
  

}


module.exports = {getRawWhois };
