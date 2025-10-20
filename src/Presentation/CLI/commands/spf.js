const { SPFRecordService } = require('../../../Business/services/DNSRecordServices/SPFRecordService.js');
const { formatMessage} = require('../../../Presentation/CLI/systemCommands.js');

module.exports = {
    name: 'spf',
    description: 'Devuelve los registros SPF de un [Dominio].',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros SPF 📬🗄️: ")), async (dominio) => {
                try {
                    const result= await SPFRecordService(dominio.trim());
                    if(result.data!=undefined){
                    console.table(result.data);}
                    else{console.log(result.message);}
                } catch (err) {
                  console.error(`${formatMessage("error", err.message)} `)
                }
                resolve();
            });
        });
    }
};