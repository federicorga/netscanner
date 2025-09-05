const { SPFRecordService } = require('../services/DNSRecordServices/SPFRecordService.js');
const { formatMessage} = require('../utils/systemCommands.js');

module.exports = {
    name: 'spf',
    description: 'Devuelve los registros SPF de un [Dominio].',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros SPF 📬🗄️: ")), async (dominio) => {
                try {
                    const spf= await SPFRecordService(dominio.trim());
                    if(spf.data!=undefined){
                    console.table(spf.data);}
                    else{console.log(spf.message);}
                } catch (err) {
                    console.error( err);
                }
                resolve();
            });
        });
    }
};