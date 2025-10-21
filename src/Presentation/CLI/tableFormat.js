const Table = require("cli-table3");
const { consoleStyles, colorMap, formatMessage } = require("./systemCommands");

function createTable(resultData,titleTable= "",head = ["filed", "Value"], valueWidthAdjustment = 50, keyWidthAdjustment= 5) {
    // Obtener el ancho de la terminal
    const terminalWidth = process.stdout.columns;

    // Iterar sobre los registros y crear una tabla para cada uno
    resultData.forEach((record, index) => {
        // Crear una nueva tabla para cada registro
        const table = new Table({
            head: head,
            wordWrap: true,
            style: { head: ["cyan"], border: ["grey"] },
        });

        // Calcular el máximo ancho de cada columna
        const maxKeyLength = Math.max(...Object.keys(record).map(key => key.length));
        const maxValueLength = Math.max(...Object.values(record).map(value => String(value).length));

        // Establecer el ancho de las columnas, limitándolo al ancho de la terminal
        const fieldColumnWidth = Math.min(Math.max(maxKeyLength + 2, 15), terminalWidth - keyWidthAdjustment);  // Ajuste para la columna "Field"
        const valueColumnWidth = Math.min(Math.max(maxValueLength + 2, 20), terminalWidth - valueWidthAdjustment);  // Ajuste para la columna "Value"

        // Asignar los anchos a la tabla
        table.options.colWidths = [fieldColumnWidth, valueColumnWidth];

        // Agregar las filas a la tabla
        Object.entries(record).forEach(([key, value]) => {
            table.push([consoleStyles.text.lightgray + key, consoleStyles.text.green + value]); // Agregar las claves y valores al arreglo de filas
        });

        
      
        if(titleTable!==false || titleTable!==""){
            console.log(`\n${consoleStyles.text.lightCyan}${titleTable} #${index + 1}:\n`);
        }
        console.log(table.toString());  // Mostrar la tabla para el registro actual

        // Agregar un salto de línea para separar cada tabla
        console.log("\n");
    });
}


// Mapa de colores por campo
function createHorizontalTable(resultData, titleTable = "", maxColumnWidth = 30, customColorMap = {}) {
  if (!resultData || resultData.length === 0) {
    console.log( formatMessage("warning","No hay datos para mostrar."));
    return;
  }

  const terminalWidth = process.stdout.columns || 100;
  const head = Object.keys(resultData[0]);

  // Colores combinados: customColorMap tiene prioridad
  const activeColorMap = { ...colorMap, ...customColorMap };

  const colWidths = head.map((key) => {
    const maxContentWidth = Math.max(
      key.length,
      ...resultData.map((record) => String(record[key] ?? "").length)
    );
    return Math.min(maxContentWidth + 2, maxColumnWidth, terminalWidth / head.length);
  });

  const table = new Table({
    head: head.map(h => (activeColorMap.__head__ || consoleStyles.text.lightgray) + h),
    style: { head: [], border: ["grey"] },
    wordWrap: true,
    colWidths: colWidths,
  });

  resultData.forEach(record => {
    table.push(
      head.map(key => {
        const value = String(record[key] ?? "");
        const color = activeColorMap[key] || consoleStyles.text.green;
        return color + value;
      })
    );
  });

  if (titleTable) {
    console.log(`\n${consoleStyles.text.lightCyan}${titleTable}:\n`);
  }

  console.log(table.toString());
  console.log("\n");
};



module.exports = { createTable,createHorizontalTable };
