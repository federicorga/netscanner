const Table = require("cli-table3");

function createTable(resultData,head = ["filed", "Value"], valueWidthAdjustment = 50, keyWidthAdjustment=5) {
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
            table.push([key, value]); // Agregar las claves y valores al arreglo de filas
        });


        console.log(table.toString());  // Mostrar la tabla para el registro actual

        // Agregar un salto de línea para separar cada tabla
        console.log("\n");
    });
}

module.exports = { createTable };
