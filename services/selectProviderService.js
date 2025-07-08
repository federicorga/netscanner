const { setDNSProvider } = require("../src/clients/api/DNSClient");



function updateDNSProvider(opcion) {

    let providerName;
 try {
      switch (opcion) {
        case "1":
          providerName= setDNSProvider("googledns");
          console.log("\n✅ Proveedor DNS configurado:", providerName);
          
          break;

        case "2":
          providerName= setDNSProvider("cloudflaredns");
          console.log("\n✅ Proveedor DNS configurado:", providerName);
         
          break;

        default:
          console.log("\n❌ Opción inválida.\n");
      
          break;
      }
    } catch (error) {
      console.error("❗ [Error] al configurar el proveedor:", error.message);
    }
}

module.exports = { updateDNSProvider};