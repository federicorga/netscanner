const https = require("https");
const http = require("http");

function checkWinRM({ host, port, protocol = "https", timeout = 5000 }) {
  return new Promise((resolve) => {
    const isHttps = protocol === "https";
    const lib = isHttps ? https : http;

    const options = {
      hostname: host,
      port: port,
      method: "OPTIONS",
      path: "/wsman",
      timeout: timeout,
    };

    if (isHttps) {
      options.rejectUnauthorized = false; // ⚠️ Ignora certificados inválidos en HTTPS
    }

    const req = lib.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve({ port, protocol, service: `WinRM-${protocol.toUpperCase()}`, status: "responding" });
      } else {
        resolve({ port, protocol, service: `WinRM-${protocol.toUpperCase()}`, status: `HTTP ${res.statusCode}` });
      }
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({ port, protocol, service: `WinRM-${protocol.toUpperCase()}`, status: "timeout" });
    });

    req.on("error", (err) => {
      resolve({ port, protocol, service: `WinRM-${protocol.toUpperCase()}`, status: "closed/filtered", error: err.message });
    });

    req.end();
  });
}

// Función para escanear puertos HTTP (80), 8080, 5985 (HTTP) y 5986 (HTTPS)
async function scanWinRM(host) {
  const portsToScan = [80, 8080, 5985, 5986]; // Puertos a escanear

  // Resultado de las pruebas
  const results = [];

  // Escanea los puertos secuencialmente
  for (const port of portsToScan) {
    let protocol = 'http'; // Asumimos HTTP por defecto
    if (port === 5986 || port === 8080) {
      protocol = 'https'; // Para el puerto 5986, usamos HTTPS
    }
    
    const result = await checkWinRM({ host, port, protocol });
    results.push(result);
  }

  // Muestra los resultados
  console.log({ host, results });
}

// Llamada a la función con la IP del servidor
scanWinRM("45.173.0.50");
