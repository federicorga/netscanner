const { portGroups } = require("../../../Infrastructure/config/portsConfig");
const { consoleStyles } = require("../systemCommands");
const {createHorizontalTable } = require("../tableFormat");



module.exports = {
    name: 'portlist',
    description: 'Devuelve una lista de puertos comunes y sus servicios asociados.',
  
       execute(){
        console.log(  `\n${consoleStyles.text.mustard}🚪 Puertos comunes y sus servicios asociados`)
        showPortGroupsByTable(portGroups); 
       }
         
};


function showPortGroupsByTable(portGroups) {


  for (const key in portGroups) {
    const group = portGroups[key];

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


    
  
  