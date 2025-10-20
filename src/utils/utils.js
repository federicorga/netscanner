
const { arrayCompanyIPs } = require("../Infrastructure/config/ipsValue.js");

function isValidIPV4(ip) { // Función para validar que es una dirección IPv4
    const parts = ip.split('.');
    

    // Verificar que hay exactamente 4 partes
    if (parts.length !== 4) return false;

    // Verificar que cada parte sea un número entre 0 y 255
    for (let i = 0; i < 4; i++) {
        const part = parseInt(parts[i], 10);
        if (isNaN(part) || part < 0 || part > 255) {
            return false;
        }
    }

    return true;
};



function isCompanyIP(ip) { // Función para verificar si una IP pertenece a la empresa
  ip = ip.trim(); // Quita espacios adelante o atrás
  
    // Validar la IP antes de proceder
    if (!isValidIPV4(ip)) {
    
        return false;
    }

    const ipParts = ip.split('.').map(Number);

    for (let i = 0; i < arrayCompanyIPs.length; i++) {
        const [rangeIp, maskStr] = arrayCompanyIPs[i].split('/');
        const rangeParts = rangeIp.split('.').map(Number);
        const mask = parseInt(maskStr, 10);


        if (mask === 8) {
            if (ipParts[0] === rangeParts[0]) {
                return true;
            }
        }

        else if (mask === 16) {
            if (ipParts[0] === rangeParts[0] &&
                ipParts[1] === rangeParts[1]) {
                return true;
            }
        }

        else if (mask === 24) {
            if (ipParts[0] === rangeParts[0] &&
                ipParts[1] === rangeParts[1] &&
                ipParts[2] === rangeParts[2]) {
                return true;
            }
        }

        else if (mask === 28) {
            if (ipParts[0] === rangeParts[0] &&
                ipParts[1] === rangeParts[1] &&
                ipParts[2] === rangeParts[2]) {

                const start = rangeParts[3];
                const end = start + 15;

                if (ipParts[3] >= start && ipParts[3] <= end) {
                    return true;
                }
            }
        }
    }


    return false;
};


function calculateDaysExpiration(expirationDateStr) {
    // Convertir la fecha de expiración (string) a un objeto Date
    const expirationDate = new Date(expirationDateStr);

    // Obtener la fecha actual
    const currentDate = new Date();

    // Calcular la diferencia en milisegundos
    const timeDifference = expirationDate - currentDate;

    // Calcular la cantidad de días restantes
    const daysRemaining = Math.floor(timeDifference / (1000 * 3600 * 24));

    // Si la fecha ya ha pasado, retornamos 0 (o un mensaje de expiración)
    if (daysRemaining < 0) {
        return "Certificado expirado";
    }

    return `${daysRemaining} días`;
};



  function isPrivateIP(ip) { // Función para verificar si una IP es privada o pública
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(part => isNaN(part) || part < 0 || part > 255)) {
        return null; // IP inválida
    }

    const [a, b] = parts;

    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;

    return false;
};



function formatDate(isoString) {
    if (!isoString || typeof isoString !== 'string') return 'No disponible';
    const date = new Date(isoString);
    if (isNaN(date)) return 'Fecha inválida';
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

async function normalizeToArray(data) { // convierte diferentes tipos de datos a un array uniforme
  // Si no hay datos, devolvemos array vacío
  if (!data) return [];

  // Aseguramos que siempre devolvemos un array de objetos
  if (Array.isArray(data)) {
    return data; // ya son registros completos
  }

  // Caso objeto individual (por ejemplo, Wavenet con { ip })
  if (typeof data === 'object') {
    return [data]; // lo envolvemos en un array
  }

  return [];
}





module.exports={isCompanyIP,isPrivateIP,formatDate,normalizeToArray, calculateDaysExpiration};