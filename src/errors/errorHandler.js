// errorHandler.js

// Función para manejar errores de manera flexible
function handleError(error, context) {
  // Si es una aplicación de consola, puedes devolver el error
  // Si es una app web, lo devuelves en un formato más amigable
  if (context === 'console') {
    console.error(`❗[Error] ${error.message}`);
  } else {
    // Aquí podrías enviar el error a una interfaz web o hacer log en un archivo, etc.
    return { status: 'error', message: error.message };
  }
}

module.exports = { handleError };


