const whois = require('whois-json');
const { formatDate } = require('../utils/utils');
const { getRawWhois } = require('../src/clients/servers/whoisClient');

const dns = require('dns').promises;



async function getDomainOwner(domain) {
    try {
        
        const data = await whois(domain); // Obtener datos WHOIS en formato JSON
        const rawData = await getRawWhois(domain); // Obtener WHOIS crudo como texto
        

        let ipAddress = 'No se pudo resolver la IP';
        try {
            const result = await dns.lookup(domain);
            ipAddress = result.address;
        } catch (ipErr) {
            ipAddress = `Error al resolver IP: ${ipErr.message}`;
        }

        const possibleFields = [
            'company', 'org', 'organization',
            'registrant', 'owner', 'registrantOrganization',
            'registrar', 'registrantName'
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

        const uniqueNS = [...new Set(nameServers.map(ns => ns.trim()))];

        // Fechas del JSON estructurado
        const created = data.created || data.creationDate || 'No disponible';
        const updated = data.updated || data.updatedDate || 'No disponible';

        // Buscar expiración manualmente en el texto WHOIS crudo
        const expirationMatch = rawData.match(/(Registry Expiry Date|Expiration Date|Registrar Registration Expiration Date):\s*(.+)/i);
        const expires = expirationMatch ? expirationMatch[2].trim() : 'No disponible';

    return {
    ...foundFields,
    ip: ipAddress,
    nameServers: uniqueNS.length > 0 ? uniqueNS : 'No se encontraron servidores de nombre (NS)',
    created: formatDate(created),
    updated: formatDate(updated),
    expires: formatDate(expires)
};

    } catch (err) {
        return `❗ [Error] al consultar WHOIS o DNS: ${err.message}`;
    }
};

module.exports = { getDomainOwner};