module.exports = {
    name: 'exit',
    description: 'Sale de la aplicación.',
    execute(rl) {
        console.log("👋 Saliendo de la aplicación. ¡Hasta luego!");
        rl.close();
        return false; // Indicar que no se debe volver a preguntar
    }
};