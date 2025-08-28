# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## 2025-08-28

### Cambios
- Se refactorizó la estructura de comandos de la aplicación para que sea más modular y escalable.
- Se creó un directorio `src/commands` para almacenar la lógica de cada comando en archivos separados.
- Se modificó `netScanner.js` para que actúe como un cargador dinámico de comandos, leyendo automáticamente los archivos del directorio `src/commands`.
- Se eliminó la duplicación de código en el bucle principal de la CLI.
