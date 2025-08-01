


    mostrarListaDePuertos = () => {// Muestra los puertos por defecto y los personalizados
     
          puertoServicios.forEach((puerto) => {
            console.log(`🔹 Puerto ${puerto.port}: ${puerto.name}`);
          });
          console.log("\n📋 Puertos comunes y sus servicios:\n");
          for (const [puerto, servicio] of Object.entries(knownPortsServices)) {
            console.log(`🔹 Puerto ${puerto}: ${servicio}`);
          }
        }

        const knownPortsServices = [ // Array de objetos con puertos y servicios asociados se utiliza para evaluar si ese puerto es conocido o no.
            { port: 20, name: 'FTP (Data)' },
            { port: 21, name: 'FTP (Control)' },
            { port: 22, name: 'Linux SSH' },
            { port: 23, name: 'Telnet' },
            { port: 25, name: 'SMTP' },
            { port: 53, name: 'DNS' },
            { port: 67, name: 'DHCP (Server)' },
            { port: 68, name: 'DHCP (Client)' },
            { port: 69, name: 'TFTP' },
            { port: 80, name: 'HTTP' },
            { port: 110, name: 'POP3' },
            { port: 115, name: 'SFTP' },
            { port: 123, name: 'NTP' },
            { port: 135, name: 'RPC' },
            { port: 137, name: 'NetBIOS Name' },
            { port: 138, name: 'NetBIOS Datagram' },
            { port: 139, name: 'NetBIOS Session' },
            { port: 143, name: 'IMAP' },
            { port: 161, name: 'SNMP' },
            { port: 162, name: 'SNMP Trap' },
            { port: 194, name: 'IRC' },
            { port: 443, name: 'HTTPS' },
            { port: 445, name: 'SMB (Server Message Block)' },
            { port: 465, name: 'SMTPS' },
            { port: 514, name: 'Syslog' },
            { port: 515, name: 'LPD/LPR (Line Printer Daemon)' },
            { port: 587, name: 'SMTP (submission)' },
            {port: 631, name: 'IPP - Internet Printing Protocol'},
            { port: 993, name: 'IMAPS' },
            { port: 995, name: 'POP3S' },
            { port: 1433, name: 'Microsoft SQL Server' },
            { port: 1521, name: 'Oracle DB' },
            { port: 2049, name: 'NFS' },
            { port: 2082, name: 'cPanel Login (no seguro)' },
            { port: 2083, name: 'cPanel Login (seguro)' },
            { port: 2086, name: 'WHM Login (no seguro - Cpanel)' },
            { port: 2087, name: 'WHM Login (seguro - Cpanel)' },
            { port: 2095, name: 'WebMail Login (no seguro - Cpanel)' },
            { port: 2096, name: 'WebMail Login (seguro - Cpanel)' },
            { port: 2483, name: 'Oracle DB (TCP)' },
            { port: 2484, name: 'Oracle DB (SSL)' },
            { port: 3306, name: 'MySQL/MariaDB' },
            { port: 3389, name: 'Windows Remote Desktop Protocol/Services (RDP/RDS)' },
            { port: 5432, name: 'PostgreSQL' },
            { port: 5900, name: 'VNC' },
            { port: 6379, name: 'Redis' },
            { port: 8080, name: 'HTTP alternativo' },
            { port: 8443, name: 'Plesk (seguro)' },
            { port: 8880, name: 'Plesk (no seguro)' },
            {port: 9100, name:'RAW Printing Port'},
            { port: 27017, name: 'MongoDB' },
            {port: 32001, name: 'Webmail alternativo (seguro)'},
            {port: 3389, name: 'RDP - Escritorio Remoto de Windows'},
        ];


       
        
         module.exports= { mostrarListaDePuertos,knownPortsServices}; // Exportamos los puertos por defecto y la función mostrarPuertos