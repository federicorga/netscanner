const { portGroups } = require("../../../Infrastructure/config/portsConfig");
const { consoleStyles } = require("../systemCommands");
const {createHorizontalTable } = require("../tableFormat");



module.exports = {
    name: 'portlist',
    description: 'Devuelve una lista de puertos comunes, sus servicios asociados y como usar portscan.',
  
       execute(){
        console.log(  `\n${consoleStyles.text.mustard}🚪 Puertos comunes y sus servicios asociados`);
        showPortGroupsByTable(portGroups);
        
            // Mensaje de uso para el command portscan
    console.log('\n' + consoleStyles.text.blue + 'Cómo usar portscan:');

    // Mensaje con formato y ejemplos
    console.log(
      consoleStyles.text.cyan +
      "Formato: " +
      consoleStyles.text.white +
      "portscan <dominio|ip> <timeout-ms> <puerto|grupo>"
    );

    console.log('\n' + consoleStyles.text.yellow + 'Descripción breve:');
    console.log(consoleStyles.text.white +
      '- dominio|ip : Dirección a escanear (ej. example.com o 192.168.1.10)');
    console.log(consoleStyles.text.white +
      '- timeout-ms  : Tiempo máximo en milisegundos para cada intento (ej. 2000)');
    console.log(consoleStyles.text.white +
      "- puerto      : Número de puerto individual (ej. 80)");
    console.log(consoleStyles.text.white +
      "- grupo       : Nombre de grupo de puertos (ej. email, web, infra). Usar 'all' para escanear todos los puertos conocidos");

    // Lista dinámica de grupos disponibles
    console.log('\n' + consoleStyles.text.green + 'Grupos disponibles:');
    console.log(consoleStyles.text.white + Object.keys(portGroups).filter(k => k !== 'all').join(', '));
    console.log(consoleStyles.text.gray + "Nota: 'all' se usa solo para escanear todos los puertos conocidos.");

    // Ejemplos prácticos
    console.log('\n' + consoleStyles.text.magenta + 'Ejemplos:');
    
    console.log(consoleStyles.text.white + "1) Escanear un puerto específico:");
    console.log(consoleStyles.text.cyan + "   portscan example.com 2000 80");
    console.log(consoleStyles.text.white + "2) Escanear un grupo de puertos (email):");
    console.log(consoleStyles.text.cyan + "   portscan example.com 3000 email");
    console.log(consoleStyles.text.white + "3) Escanear todos los puertos conocidos:");
    console.log(consoleStyles.text.cyan + "   portscan 192.168.1.10 5000 all");
        console.log(consoleStyles.text.white + "4) Escanear con timeout por defecto:");
    console.log(consoleStyles.text.cyan + "   portscan example.com -td 80");

    // Consejo/aviso
    console.log('\n' + consoleStyles.text.red +
      "Aviso: Escanear puertos en sistemas que no administrás puede ser ilegal o mal visto. " +
      "Usá estas herramientas solo en hosts autorizados."
    );
       }
         
};


function showPortGroupsByTable(portGroups) {


  for (const key in portGroups) {

    const group = portGroups[key];

 if (group.hidden) continue; // Saltamos el grupo 'all' para evitar duplicados
    // Construimos los datos en formato [{ Puerto: 123, Servicio: '...' }]
    const tableData = group.ports.map(({ port, service }) => ({
      Puerto: port,
      Servicio: service
    }));

    createHorizontalTable(
      tableData,
      `${group.name} - ${group.description}`,
      40,
      {
        __head__: consoleStyles.text.blue,
        Puerto: consoleStyles.text.cyan,
      }
    );
  }
};


    
  
  