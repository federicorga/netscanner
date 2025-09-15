
const rawWhois = require('whois');


function getRawWhois(domain) { // Función para obtener el WHOIS crudo
    return new Promise((resolve, reject) => {

        rawWhois.lookup(domain, (err, data) => {

            if (err) reject(err);

            else resolve(data); // Devolvemos el WHOIS crudo como una cadena de texto
        });
    });
}


module.exports = {getRawWhois };
