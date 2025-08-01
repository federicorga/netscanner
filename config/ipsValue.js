// Función para generar un rango de IPs
function addIpRange(start, end) {
  const ipArray = [];
  const startParts = start.split('.').map(Number);
  const endParts = end.split('.').map(Number);

  for (let i = startParts[3]; i <= endParts[3]; i++) {
    ipArray.push(`${startParts[0]}.${startParts[1]}.${startParts[2]}.${i}`);
  }

  return ipArray;
};


//IPS de de la empresa para evaluar si los servicios estan con ellos se puede agregar /24, /16, /8 o /28

arrayCompanyIPs=[
"45.173.0.0/24",
"45.173.1.0/24",
"45.173.2.0/24",
"45.173.3.0/24",
"148.222.144.0/24",
"148.222.145.0/24",
"148.222.146.0/24",
"148.222.147.0/24",
"148.222.148.0/24",
"148.222.149.0/24",
"148.222.150.0/24",
"148.222.151.0/24",
"148.222.156.0/24",
"148.222.157.0/24",
"148.222.159.0/24",
"200.61.185.193/28",

];

//const rangeIps =addIpRange("200.61.185.193", "200.61.185.206");
//arrayCompanyIPs.push(...rangeIps); // Agrega el rango de IPs al array de Wavenet

module.exports = {arrayCompanyIPs};