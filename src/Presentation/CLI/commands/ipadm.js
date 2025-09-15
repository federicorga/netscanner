const{ arrayCompanyIPs } = require('../../../Infrastructure/config/ipsValue.js');
const { companyName } = require('../../../Infrastructure/config/config.js');

module.exports = {
    
    name: 'ipadm',
    description: `Muestra la lista de IPs administradas por ${companyName}.`,
    execute() {
        console.log(`\n✅ Lista de IPs de ${companyName}: `);
        console.log(arrayCompanyIPs);
    }
};