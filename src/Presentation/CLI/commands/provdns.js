const { updateDNSProviderService } = require('../../../Business/services/selectProviderService.js');
const { formatMessage } = require('../systemCommands.js');

module.exports = {
    name: 'provdns',
    description: 'Configura el proveedor de DNS.',
    execute(rl) {
        return new Promise(resolve => {
            console.log("🔧 Elegí un proveedor DNS:");
            console.log("1️  GoogleDNS");
            console.log("2  CloudflareDNS");
            console.log("3  WavenetDNS");
            rl.question("➡️ Ingresá el número de la opción: ", async (input) => {

                try{
                const result= await updateDNSProviderService(input.trim());

                if( result.success===false) {
          
              console.log(formatMessage("warning", result.message));
            }else{

            
                    console.log(formatMessage("success",result.message));
                    console.log("🌐 Ahora las consultas DNS se harán a través de ",result.provider);
            }
                
           
            }catch(err){
                console.error(formatMessage("error",`${err.message}`));
               
            }
             resolve();
            });
        });
    }
};