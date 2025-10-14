const { setDNSProvider } = require("../../Infrastructure/repository/clients/api/DNSClient.js");
    



async function updateDNSProviderService(opcion) {
  let providerName;
  try {
    switch (opcion) {
      case "1":
        providerName = await setDNSProvider("googledns");
      
        return { success: true, message: "Proveedor DNS configurado",  provider:providerName };

      case "2":
        providerName = await setDNSProvider("cloudflaredns");
        return { success: true, message: "Proveedor DNS configurado", provider:providerName };

      case "3":
        providerName = await setDNSProvider("wavenetdns");
        return { success: true, message: "Proveedor DNS configurado",  provider:providerName };

      default:
        return { success: false, message: "Opción inválida." };
    }
  } catch (error) {
    return { success: false, message: `No se pudo configurar el proveedor: ${error.message}` };
  }
}
module.exports = { updateDNSProviderService};