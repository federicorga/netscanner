/*async function getRegister(domain, register) {
    // Devuelve el registro de un dominio
    const registerResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=${register}`);
    
    // Asegúrate de que la respuesta es válida antes de intentar parsear el JSON
    if (!registerResponse.ok) {
        throw new Error(`❗ [Error] fetching data: ${registerResponse.statusText}`);
    }

    const registerData = await registerResponse.json(); // Usamos registerResponse, no ipResponse

    return registerData; // ✅ Devuelve el objeto registro completo
};*/




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

// Función de configuración externa
function setDNSProvider(providerName) {

    switch (providerName.toLowerCase()) {
        case "googledns":
            currentProvider = new GoogleDNS();
            
            break;
        case "cloudflaredns":
            currentProvider = new CloudflareDNS();
            
            break;
        default:
            throw new Error(`❗ [Error] Unknown DNS provider: ${providerName}`);
    }

    return currentProvider; // Retorna la instancia del proveedor configurado
}

// Función principal que parece "global"
async function getRegister(domain, type) {

     if (!currentProvider) {
        throw new Error("❗ [Error] DNS provider is not set.");
    }
    return await currentProvider.resolve(domain, type);
}

module.exports = { getRegister, setDNSProvider };
