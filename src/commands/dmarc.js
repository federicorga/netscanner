const { DMARCRecordService } = require('../services/DNSRecordServices/DMARCRecordService.js');
const { formatMessage} = require('../utils/systemCommands.js');
const Table = require('cli-table3'); // <-- importamos cli-table3

module.exports = {
    name: 'dmarc',
    description: 'Devuelve los registros DMARC de un dominio.',
    execute(rl) {
        return new Promise(resolve => {
            rl.question(formatMessage("request",("\n🔎 Ingrese [Dominio] para la búsqueda de registros DMARC 📧🔐: ")), async (dominio) => {
                try {
                   const result= await DMARCRecordService(dominio.trim());
                   
                     console.log('\n' + result.message + '\n');
                    // Creamos la tabla vertical
                    const table = new Table({
                    head: ['Campo', 'Valor', 'Descripcion'],
                    style: { head: ['cyan'], border: ['grey'] }
                    });

                    // Agregamos cada objeto como fila
                    result.data.forEach(row => {
                    table.push([row.Campo, row.Valor, row.Descripcion]);
                    });

                    console.log(table.toString());

                } catch (err) {
                    console.error("❗ [Error] al obtener el registro DMARC:", err);
                }
                resolve();
            });
        });
    }
};