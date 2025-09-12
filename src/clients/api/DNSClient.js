


const DNS = require('dns2');

let currentProvider = null; // Variable para almacenar el proveedor DNS actual

// Base class
class DNSProvider { // Abstract class simula una interfaz
 
    async resolve(domain, type) {
        throw new Error("Method 'resolve' must be implemented.");
    }
}



//=================PROVEDORES==================

// Google provider
class GoogleDNS extends DNSProvider {
    async resolve(domain, type) {
        const res = await fetch(`https://dns.google/resolve?name=${domain}&type=${type}`);
        if (!res.ok) throw new Error(`Google DNS error: ${res.statusText}`);
        return res.json();
    }
}

// Cloudflare provider
class CloudflareDNS extends DNSProvider {
    async resolve(domain, type) {
        const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=${type}`, {
            headers: { accept: 'application/dns-json' }
        });
        if (!res.ok) throw new Error(`Cloudflare DNS error: ${res.statusText}`);
        return res.json();
    }
}

// DNS personalizado (como Wavenet)
class CustomDNS extends DNSProvider {
    constructor(serverIP) {
        super();
        this.client = DNS.UDPClient({ dns: serverIP, port: 53, recursive: true });
    }

    async resolve(domain, type) {
        const res = await this.client(domain, type);
        // Adaptamos para que todas las respuestas tengan .Answer
        return { Answer: res.answers || [] };
    }
}


// Función de configuración externa
function setDNSProvider(providerName) {

    switch (providerName.toLowerCase()) {
        case "googledns":
            currentProvider = new GoogleDNS();
            
            break;
        case "cloudflaredns":
            currentProvider = new CloudflareDNS();
            
            break;

        case "wavenetdns":
            currentProvider = new CustomDNS("45.173.0.46"); 

            break;  
        default:
            throw new Error(`Unknown DNS provider: ${providerName}`);
    }

    return currentProvider; // Retorna la instancia del proveedor configurado
}


//===================================


// Función para obtener registros DNS crudo
async function getRegister(domain, type) {
    const provider = currentProvider; // Usamos el proveedor configurado globalmente

    if (!provider) {
        // Error esperado: proveedor no configurado
        const err = new Error("DNS provider is not set.");
        err.data = { meta: { domain, type } }; // incluimos meta dentro de data
        throw err; // va al catch del caller
    }

    try {
        const result = await provider.resolve(domain, type);

        return {
            success: true,
            message: `Registros ${type} obtenidos correctamente.`,
            error: null,
            data: result,
            meta: { domain, type },
        };
    } catch (err) {
        // Capturamos cualquier error del proveedor
        return {
            success: false,
            message: `Error al consultar registros DNS ${type}: ${err.message}`,
            error: err,
            data: null,
            meta: { domain, type },
        };
    }
}

// Función para chequear salud del servidor DNS
async function checkDNSHealth(serverIP, testDomain = "google.com", type = "A", timeoutMs = 2000) { 
    const client = DNS.UDPClient({ dns: serverIP, port: 53, recursive: true });
    return Promise.race([
        client(testDomain, type)
            .then(res => res && res.answers && res.answers.length > 0)
            .catch(() => false),
        new Promise(resolve => setTimeout(() => resolve(false), timeoutMs))
    ]);
}



module.exports = { getRegister, setDNSProvider,checkDNSHealth };