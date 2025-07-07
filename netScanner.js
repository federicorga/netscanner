
//utils
const { logo } = require("./utils/logoCMD.js");
const { clearConsole, consoleStyles, consoleControl} = require('./utils/systemCommands.js');
const { getIp, isCompanyIP } = require("./utils/utils.js");
//config
const { listCommands, companyName } = require('./config/config.js');
const {arrayCompanyIPs} = require("./config/ipsValue.js"); 


//Controladores
const { StartCLI } = require("./controllers/CLIController.js");


//API

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
const { grabBanner, getBannersFromInput } = require("./utils/grabBanner.js");

// ---------------------------------------------------------------------------------------------------------------------------------------------


console.log(`${logo}`); // Muestra el logo al iniciar el programa

const rl=StartCLI();


preguntar();


function preguntar() {
    rl.question("\nIngrese comando disponible (o escriba 'help' para mas info) : ", async (input) => {


      if (input.trim().toLowerCase() === 'portscan') { // Si el usuario escribe 'portscan', le pedimos la IP y los puertos
        rl.question("\n🔎 Ingrese (IP o Dominio), tiempo y puertos para escanear 📡​​: ", async (dominio) => {
           
            await getPortsStatus(dominio.trim())
            preguntar(); 
        });
        return;
    }

          if (input.trim().toLowerCase() === 'ipinfo'){ // Si el usuario escribe 'ipinfo', le pedimos la IP o dominio
        rl.question("\n🔎 Ingrese (IP o Dominio), para devolver informacion completa desde ipinfo ℹ️​​: ", async (dominio) => {
           
            const result= await getIpInfo(dominio.trim())
          mostrarIpInfo(result);
            preguntar(); 
        });
        return;
    }
      
        if (input.trim().toLowerCase() === 'exit') {// Si el usuario escribe 'salir', cerramos la interfaz de readline
            console.log("👋Saliendo de la aplicacion. ¡Hasta luego!");
            rl.close();
            return;
        };

        if (input.trim().toLowerCase() === 'clear') {// Limpia la consola
            clearConsole();
            preguntar(); 
          }

        if (input.trim().toLowerCase() === 'ping') { 
          rl.question("\n🔎 Ingrese (IP o Dominio) para hacer ping 📶: ", async (dominio) => {
              try {
                  const resultado = await pingHost(dominio.trim()); 
                  console.log(resultado);
              } catch (err) {
                  console.error("❗ [Error] al hacer ping:", err);
              }
              preguntar(); 
          });
          return;
      };

              if (input.trim().toLowerCase() === 'serialssl') { 
          rl.question("\n🔎 Ingrese el serial para verificar si el certificado es valido 🔑: ", async (serialssl) => {
              try {
                  const resultado = await getCrtShIdFromSHA1(serialssl.trim());
                  
                  console.log(`\n🆔 Número ID de Certificado: ${consoleStyles.text.green} ${resultado} ${consoleControl.resetStyle}`);
                   console.log(`\n🔗 Url del Certificado:${consoleStyles.text.green} ${`https://crt.sh/?q=${resultado}${consoleControl.resetStyle}`}`);
              } catch (err) {
                  console.error("❗ [Error] al obtener el serial:", err);
              }
              preguntar(); 
          });
          return;
      };

             if (input.trim().toLowerCase() === 'infos') {
          rl.question("\n🔎 Ingrese (IP o Dominio) para devolver la información del servidor asociado 🖥️: ", async (dominio) => {
            
            await scanServerInfo(dominio.trim());
              
            preguntar(); 
          });
          return;
        };
  

        if (input.trim().toLowerCase() === 'mx') {
            rl.question("\n🔎 Ingrese (Dominio) para la busqueda de registros MX 📧: ", async (dominio) => {
                const tieneMX = await getMxRecord(dominio.trim());
        
                if (tieneMX) {
                    await tracerMxMailServiceProvider(dominio.trim());
                  }

                console.log('Registro MX:',tieneMX);
                preguntar(); 
            });
            return;
        };


        if (input.trim().toLowerCase() === 'ns') {
          rl.question("\n🔎 Ingrese (Dominio) para la busqueda de registros NS 🏢: ", async (dominio) => {
              const tieneNS = await getNsRecord(dominio.trim());
      
              console.log('Registro NS:',tieneNS);
            
              preguntar(); 
          });
          return;
      };


      if (input.trim().toLowerCase() === 'a') {
        rl.question("\n🔎 Ingrese (Dominio) para la busqueda de registros A 🌐🔗📍: ", async (dominio) => {
            const tieneA=await getARecord(dominio.trim());
            console.log('Registro A:',tieneA)
            preguntar(); 
        });
        return;
    };

          if (input.trim().toLowerCase() === 'txt') {
        rl.question("\n🔎 Ingrese (Dominio) para la busqueda de registros TXT 📜: ", async (dominio) => {
            await getTXTRecords(dominio.trim());
            preguntar();
        });
        return;
    };

    
    if (input.trim().toLowerCase() === 'cname') {
        rl.question("\n🔎 Ingrese (Dominio) para la busqueda de registros CNAME 🔀: ", async (dominio) => {
            await getCnameRecord(dominio.trim());
            preguntar(); 
        });
        return;
    };

  

        if (input.trim().toLowerCase() === 'ptr') {
          rl.question("\n🔎 Ingrese (Dominio o IP) para la busqueda de Dominio asociado PTR 🔁: ", async (dominio) => {
             const ptr=await getPtrRecord(dominio.trim());
              
            console.log(ptr);
              
              preguntar(); 
          });
         
          return;
      };

        if (input.trim().toLowerCase() === 'spf') {
        rl.question("\n🔎 Ingrese (Dominio) para la busqueda de registros SPF 📬🗄️: ", async (dominio) => {
           await SPFRecordService(dominio.trim());

            
            preguntar(); // Volver al CLI
        });

        return;
        };

          if (input.trim().toLowerCase() === 'dkim') {
        rl.question("\n🔎 Ingrese (Dominio) para la busqueda de registros DKIM 📬🛡️: ", async (dominio) => {
           await DKIMLookupService(dominio.trim());

            
            preguntar(); // Volver al CLI
        });

        return;
        };

              if (input.trim().toLowerCase() === 'dmarc') {
        rl.question("\n🔎 Ingrese (Dominio) para la busqueda de registros DMARC 📧🔐: ", async (dominio) => {
           await DMARCRecordService(dominio.trim());

            
            preguntar(); // Volver al CLI
        });

        return;
        };

              if (input.trim().toLowerCase() === 'whois') {
        rl.question("\n🔎 Ingrese (Dominio o IP) para la busqueda en WHOIS❓: ", async (dominio) => {
            const whois=await getDomainOwner(dominio.trim());
          console.log('Registro Whois:',whois)
            preguntar(); 
        });
        return;
    };


                     if (input.trim().toLowerCase() === 'blacklist') {
        rl.question("\n🔎 Ingrese (IP) para la busqueda en blacklist 📓​: ", async (dominio) => {
           await checkBlacklist(dominio.trim());

            
            preguntar(); // Volver al CLI
        });

        return;
        };


        if (input.trim().toLowerCase() === 'grab') {
        rl.question("\n🔎 Ingrese (IP y Puerto) para la busqueda📓​: ", async (dominio) => {
           await  getBannersFromInput(dominio.trim());
          
            
            preguntar(); // Volver al CLI
        });

        return;
        };

      
        if (input.trim().toLowerCase() === 'ssl') {
          rl.question("\n🔎 Ingrese (Dominio) para la busqueda de certificado SSL 🔏​​: ", async (dominio) => {
  try {
      const ssl = await pruebaSSL(dominio.trim(),32001);
      console.log(ssl);
    } catch (err) {
      console.error("❌ Error al obtener la información SSL:", err.message || err);
    } finally {
      preguntar(); // Vuelve a mostrar el menú u opciones
    }
  });
          return;
      };


        if (input.trim().toLowerCase() === 'help') {
            console.log(`${listCommands}\n`)
            return preguntar();
        };

        
        if (input.trim().toLowerCase() === `ip${companyNameLower}`) { 
          rl.question(`\n🔎 Ingrese (IP) para verificar si pertenece a ${companyName} 🏠: `, async (ip) => {
            isCompanyIP(ip.trim()) ? console.log(`\n✅ La IP pertenece a ${companyName}`) : console.log(`\n❌ La IP no pertenece a ${companyName}`);
            preguntar();
          });
           return 
        };

        if (input.trim().toLowerCase() === 'ipadm') {//
            console.log(`\n✅ Lista de IPs de ${companyName}: `);
            console.log(arrayCompanyIPs);
               
            return preguntar();
          };
           
        if (input.trim().toLowerCase() === 'ip') { // Si el usuario escribe 'ip', le pedimos un dominio para obtener la IP
        rl.question("\n🔎 Ingrese (Dominio) para la busqueda de IP 📍: ", async (dominio) => {
            try {
                const IP = await getIp(dominio.trim()); // Intentar obtener la IP del dominio
                console.log("\nIP:", IP);
            } catch (err) {
                console.error("❗ [Error] al obtener la IP:", err);
                // Después de un error no volvemos a preguntar en este bloque.
            }
           
            preguntar(); 
        });
        return; // Aquí nos aseguramos de que no continue con los demás comandos
    };

  // Si no es un comando válido, muestra un mensaje
  console.log("❌ Comando no válido. Escribe un comando correcto o 'help' para ver los comandos disponibles.");
  preguntar(); // Vuelve a preguntar al usuario
    });
};









