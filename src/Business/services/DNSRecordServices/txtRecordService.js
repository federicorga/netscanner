const { getRegister } = require("../../../Infrastructure/repository/clients/api/DNSClient.js");
const { normalizeToArray } = require("../../../utils/utils.js");


async function getTXTRecords(domain) { 
 
    try{
    const raw = await getRegister(domain, "TXT"); 
    if (!raw.success) return raw;  
    const records = await normalizeToArray(raw.data.Answer);
    return{ 
       ...raw,
        data: records, 
    };
    
} catch(err){
   
        throw new Error(`${err.message}`)
    
};
}

async function txtLookupService(domain) {
    const result = await getTXTRecords(domain);

       if (!result.success) {
        return result
    }

    return{
        ...result,
    }
}




module.exports = { txtLookupService };