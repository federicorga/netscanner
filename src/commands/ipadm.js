const{ arrayCompanyIPs } = require('../config/ipsValue.js');
const { companyName } = require('../config/config.js');

module.exports = {
    
    name: 'ipadm',
    description: `Muestra la lista de IPs de ${companyName}.`,
    execute() {
        console.log(`\n✅ Lista de IPs de ${companyName}: `);
        console.log(arrayCompanyIPs);
    }
};