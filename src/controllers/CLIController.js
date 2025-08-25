const readline = require('readline');

function StartCLI() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Aquí va tu lógica de readline, como preguntar(), etc.
    return rl;
}

module.exports = { StartCLI };  // Exportamos la función