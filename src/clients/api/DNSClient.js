


const DNS = require('dns2');

let currentProvider = null; // Variable para almacenar el proveedor DNS actual

// Base class
class DNSProvider {

    async resolve(domain, type) {
        throw new Error("❗ [Error] Method 'resolve' must be implemented.");
    }
}

// Google provider
class GoogleDNS extends DNSProvider {
    async resolve(domain, type) {
        const res = await fetch(`https://dns.google/resolve?name=${domain}&type=${type}`);
        if (!res.ok) throw new Error(`❗ [Error] Google DNS error: ${res.statusText}`);
        return res.json();
    }
}

// Cloudflare provider
class CloudflareDNS extends DNSProvider {
    async resolve(domain, type) {
        const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=${type}`, {
            headers: { accept: 'application/dns-json' }
        });
        if (!res.ok) throw new Error(`❗ [Error] Cloudflare DNS error: ${res.statusText}`);
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
            throw new Error(`❗ [Error] Unknown DNS provider: ${providerName}`);
    }

    return currentProvider; // Retorna la instancia del proveedor configurado
}

// Función principal que parece "global"
async function getRegister(domain, type) {

    if (!currentProvider) {
        return {
            success: false,
            error: "❗ DNS provider is not set.",
            data: null,
        };
    }

    try {
        const result = await currentProvider.resolve(domain, type);

        return {
            success: true,
            error: null,
            data: result,
            meta: {
                domain,
                type,
               
            }
        };

    } catch (err) {
        return {
            success: false,
            error: err.message || "Unknown DNS error",
            data: null,
            meta: {
                domain,
                type,

               
            }
        };
    }
}


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