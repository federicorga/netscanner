const whois = require('whois-json');
const { getRawWhois } = require('../src/clients/servers/whoisClient');


const dns = require('dns').promises;



async function getDomainOwner(input) {
    try {

            const [domainInput, fullInput] = input.trim().split(" ");

    const domain = domainInput;
   
        
        const data = await whois(domain); // Obtener datos WHOIS en formato JSON
        const rawData = await getRawWhois(domain); // Obtener WHOIS crudo como texto
        

        let ipAddress = 'No se pudo resolver la IP';
        try {
            const result = await dns.lookup(domain);
            ipAddress = result.address;
        } catch (ipErr) {
            ipAddress = `Error al resolver IP: ${ipErr.message}`;
        }

        const possibleFields = [ // Busca campos con los siguentes nombres en el JSON de WHOIS
            'domainName','domain','company','name', 'org', 'organization','owner', 'registrantOrganization', 'registrantName','registrar','registrant','registrarWhoisServer','registrarUrl','registered','creationDate'
            ,'created','updatedDate','lastUpdateOfWhoisDatabase','changed','registrarRegistrationExpirationDate','expire','nameServer','nserver'
        ];

        const nsFields = ['nameServer', 'nserver', 'Name Server'];
        const foundFields = {};
        const nameServers = [];

        for (const field of possibleFields) { 
            if (data[field]) {
                foundFields[field] = data[field];
            }
        }

        for (const key in data) {
            for (const nsField of nsFields) {
                if (key.toLowerCase().includes(nsField.toLowerCase())) {
                    const value = data[key];
                    if (Array.isArray(value)) {
                        nameServers.push(...value);
                    } else {
                        nameServers.push(value);
                    }
                }
            }
        }


if(fullInput==='-f'){
    return {
        filedsWhois: data,
    }
}

    return {
       
    filedsWhois:foundFields,
    
};

    } catch (err) {
        return `❗ [Error] al consultar WHOIS o DNS: ${err.message}`;
    }
};

module.exports = { getDomainOwner};