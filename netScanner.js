
//utils
const { logo } = require('./utils/logoCMD.js');

const { clearConsole, consoleStyles, consoleControl} = require('./utils/systemCommands.js');
const { getIp, isCompanyIP } = require("./utils/utils.js");
//config
const { listCommands, companyName, companyNameLower } = require('./config/config.js');
const {arrayCompanyIPs} = require("./config/ipsValue.js"); 


//Controladores
const { StartCLI } = require("./controllers/CLIController.js");

//Servicos
const { getPortsStatus } = require("./services/portScannerService.js");
const { pingHost } = require("./services/pingService.js");
const { getMxRecord, tracerMxMailServiceProvider } = require("./services/DNSRecordServices/mxRecordService.js");
const { getNsRecord } = require("./services/DNSRecordServices/nsRecordService.js");
const { getARecord } = require("./services/DNSRecordServices/aRecordService.js");
const { getCnameRecord } = require("./services/DNSRecordServices/cnameRecordService.js");
const { getPtrRecord } = require("./services/DNSRecordServices/ptrRecordService.js");
const { getTXTRecords } = require("./services/DNSRecordServices/txtRecordService.js");
const { scanServerInfo } = require("./services/scanServerService.js");
const { getCrtShIdFromSHA1, pruebaSSL} = require("./services/SSLService.js");
const { checkBlacklist } = require("./services/blackListService.js");
const { getDomainOwner } = require("./services/whoisService.js");
const {SPFRecordService } = require("./services/DNSRecordServices/SPFRecordService.js");
const { DKIMLookupService } = require("./services/DNSRecordServices/DKIMRecordService.js");
const { DMARCRecordService } = require("./services/DNSRecordServices/DMARCRecordService.js");
const { getIpInfo, mostrarIpInfo } = require("./src/clients/api/ipInfoClient.js");
const { getBannersFromInput } = require("./utils/grabBanner.js");
const { setDNSProvider } = require("./src/clients/api/DNSClient.js");
const {updateDNSProvider } = require("./services/selectProviderService.js");
const { portGroups } = require("./config/portGroups.js");



//API

setDNSProvider("googledns"); // Configura el proveedor DNS a usar  al iniciar el programa



// ---------------------------------------------------------------------------------------------------------------------------------------------


console.log(`${logo}`); // Muestra el logo al iniciar el programa

const rl=StartCLI();


preguntar();

function preguntar() {

  
  rl.question("\nIngrese comando disponible (o escriba 'help' para mas info) : ", async (input) => {

    
    const command = input.trim().toLowerCase();

    switch (command) {

        case 'help':
        console.log(`${listCommands}\n`);
        preguntar();
        break;

      case 'exit':
        console.log("👋 Saliendo de la aplicación. ¡Hasta luego!");
        rl.close();
        break;

      case 'clear':
        clearConsole();

        preguntar();
        break;


      case 'portscan':
      
        rl.question("\n🔎 Ingrese (IP o Dominio), tiempo y puertos para escanear 📡​​: ", async (dominio) => {
          await getPortsStatus(dominio.trim());
          preguntar();
        });
        break;

      case 'ipinfo':
        
        rl.question("\n🔎 Ingrese (IP o Dominio), para devolver informacion completa desde ipinfo ℹ️​​: ", async (dominio) => {
        try{
          const result = await getIpInfo(dominio.trim());
          mostrarIpInfo(result);
        }catch (err) {
          console.error("❗ [Error] al obtener información de IP:", err);
        }
        
        preguntar();
        });
        break;


         case 'provdns':
            console.log("🔧 Elegí un proveedor DNS:");
            console.log("1️⃣  GoogleDNS");
            console.log("2️⃣  CloudflareDNS");

            rl.question("➡️ Ingresá el número de la opción: ", (input) => {
          updateDNSProvider(input.trim());
 
          preguntar();
            });
        break;


     

      case 'ping':
        rl.question("\n🔎 Ingrese (IP o Dominio) para hacer ping 📶: ", async (dominio) => {
          try {
            const resultado = await pingHost(dominio.trim());
            console.log(resultado);
          } catch (err) {
            console.error("❗ [Error] al hacer ping:", err);
          }
          preguntar();
        });
        break;

      case 'serialssl':
        rl.question("\n🔎 Ingrese el serial para verificar si el certificado es válido 🔑: ", async (serialssl) => {
          try {
            const resultado = await getCrtShIdFromSHA1(serialssl.trim());
            console.log(`\n🆔 Número ID de Certificado: ${consoleStyles.text.green} ${resultado} ${consoleControl.resetStyle}`);
            console.log(`\n🔗 Url del Certificado:${consoleStyles.text.green} https://crt.sh/?q=${resultado}${consoleControl.resetStyle}`);
          } catch (err) {
            console.error("❗ [Error] al obtener el serial:", err);
          }
          preguntar();
        });
        break;

      case 'infos':
        rl.question("\n🔎 Ingrese (IP o Dominio) para devolver la información del servidor asociado 🖥️: ", async (dominio) => {
          try{
          await scanServerInfo(dominio.trim());
          }catch(err){
            console.error("❗ [Error] al obtener la información del servidor:", err);
          }
          preguntar();
        });
        break;

      case 'mx':
        rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de registros MX 📧: ", async (dominio) => {
          try{
          const tieneMX = await getMxRecord(dominio.trim());
          if (tieneMX) await tracerMxMailServiceProvider(dominio.trim());
          console.log('Registro MX:', tieneMX);
          }catch(err){
            console.error("❗ [Error] al obtener el registro MX:", err);
          }
          preguntar();
        });
        break;

      case 'ns':
        rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de registros NS 🏢: ", async (dominio) => {
          try{
          const tieneNS = await getNsRecord(dominio.trim());
          console.log('Registro NS:', tieneNS);
          }catch(err){
            console.error("❗ [Error] al obtener el registro NS:", err);}

          preguntar();
        });
        break;

      case 'a':
        rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de registros A 🌐🔗📍: ", async (dominio) => {
          try{
          const tieneA = await getARecord(dominio.trim());
          console.log('Registro A:', tieneA);
          }catch(err){
            console.error("❗ [Error] al obtener el registro A:", err);
          }
          preguntar();
        });
        break;

      case 'txt':
        rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de registros TXT 📜: ", async (dominio) => {
          try{
          await getTXTRecords(dominio.trim());
          }catch(err){
            console.error("❗ [Error] al obtener los registros TXT:", err);}
          preguntar();
        });
        break;

      case 'cname':
        rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de registros CNAME 🔀: ", async (dominio) => {
          try{
          await getCnameRecord(dominio.trim());}
          catch(err){
            console.error("❗ [Error] al obtener el registro CNAME:", err);
          }
          preguntar();
        });
        break;

      case 'ptr':
        rl.question("\n🔎 Ingrese (Dominio o IP) para la búsqueda de Dominio asociado PTR 🔁: ", async (dominio) => {
          try{
          const ptr = await getPtrRecord(dominio.trim());
          console.log(ptr);
          }catch(err){
            console.error("❗ [Error] al obtener el registro PTR:", err);}
          preguntar();
        });
        break;

      case 'spf':
        
        rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de registros SPF 📬🗄️: ", async (dominio) => {
        try{
          await SPFRecordService(dominio.trim());
        }catch(err){
          console.error("❗ [Error] al obtener el registro SPF:", err);
        }
          preguntar();
        });
        break;

      case 'dkim':
        rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de registros DKIM 📬🛡️: ", async (dominio) => {
        try{
          await DKIMLookupService(dominio.trim());
        }catch(err){
          console.error("❗ [Error] al obtener el registro DKIM:", err);}
          preguntar();
        });
        break;

      case 'dmarc':
        rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de registros DMARC 📧🔐: ", async (dominio) => {

          try{
          await DMARCRecordService(dominio.trim());
          }catch(err){
            console.error("❗ [Error] al obtener el registro DMARC:", err);}
          preguntar();
        });
        break;

      case 'whois':
        rl.question("\n🔎 Ingrese (Dominio o IP) para la búsqueda en WHOIS❓: ", async (dominio) => {
          try{
          const whois = await getDomainOwner(dominio.trim());
          console.log('\nRegistro Whois:', whois.filedsWhois);
        }
        catch (err) {
          console.error("❗ [Error] al obtener el registro WHOIS:", err);}

          preguntar();
        });
        break;

      case 'blacklist':
        rl.question("\n🔎 Ingrese (IP) para la búsqueda en blacklist 📓​: ", async (dominio) => {
          try{
          await checkBlacklist(dominio.trim());
          }catch(err){
            console.error("❗ [Error] al verificar la blacklist:", err);}
          preguntar();
        });
        break;

      case 'grab':
        rl.question("\n🔎 Ingrese (IP y Puerto) para la búsqueda 📓​: ", async (dominio) => {
          await getBannersFromInput(dominio.trim());
          preguntar();
        });
        break;

      case 'ssl':
        rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de certificado SSL 🔏​​: ", async (dominio) => {
          try {
            const ssl = await pruebaSSL(dominio.trim());
            console.log(ssl);
          } catch (err) {
            console.error("❗ [Error] al obtener la información SSL:", err.message || err);
          } finally {
            preguntar();
          }
        });
        break;

    

      case `ip${companyNameLower}`:
        rl.question(`\n🔎 Ingrese (IP) para verificar si pertenece a ${companyName} 🏠: `, async (ip) => {

          try{
          isCompanyIP(ip.trim())
            ? console.log(`\n✅ La IP pertenece a ${companyName}`)
            : console.log(`\n❌ La IP no pertenece a ${companyName}`);
          } catch (err) {
            console.error("❗ [Error] al verificar la IP:", err);}
          preguntar();
        });
        break;

      case 'ipadm':
        console.log(`\n✅ Lista de IPs de ${companyName}: `);
        console.log(arrayCompanyIPs);
        preguntar();
        break;

      case 'ip':
        rl.question("\n🔎 Ingrese (Dominio) para la búsqueda de IP 📍: ", async (dominio) => {
          try {
            const IP = await getIp(dominio.trim());
            console.log("\nIP:", IP);
          } catch (err) {
            console.error("❗ [Error] al obtener la IP:", err);
          }
          preguntar();
        });
        break;

      default:
        console.log("❌ Comando no válido. Escribe un comando correcto o 'help' para ver los comandos disponibles.");
        preguntar();
        break;
    }
  });
};









