


function generateListAllPorts(portGroups) { // Función para generar una lista plana de todos los puertos y sus servicios
  const allPorts = [];

  for (const groupKey in portGroups) {
    const group = portGroups[groupKey];
    group.ports.forEach(({ port, service }) => {
      allPorts.push({
        port,
        service
      });
    });
  }

  // Ordenar por número de puerto ascendente
  allPorts.sort((a, b) => a.port - b.port);

  return allPorts;
}



const portsEmail={
    name: 'email',
    description: 'Puertos relacionados con servicios de correo electrónico',
    ports: [
      { port: 25, service: 'SMTP' },
      { port: 465, service: 'SMTPS' },
      { port: 587, service: 'SMTP (submission)' },
      { port: 110, service: 'POP3' },
      { port: 995, service: 'POP3S' },
      { port: 143, service: 'IMAP' },
      { port: 993, service: 'IMAPS' },
      { port: 2095, service: 'cPanel (no seguro - Webmail)' },
      { port: 2096, service: 'cPanel (seguro - Webmail standar)' },
      {port: 32001, service: 'Webmail alternativo (seguro)'},

    ]
  };

  const portsSSL = {
  name: 'ssl',
  description: 'Puertos de servicios que usan SSL/TLS para conexiones seguras',
  ports: [
    { port: 443, service: 'HTTPS' },
    { port: 465, service: 'SMTPS (SMTP sobre SSL)' },
    { port: 993, service: 'IMAPS (IMAP sobre SSL)' },
    { port: 995, service: 'POP3S (POP3 sobre SSL)' },
    { port: 2083, service: 'cPanel Webmail seguro (HTTPS)' },
    { port: 2087, service: 'cPanel WHM seguro (HTTPS)' },
    { port: 2096, service: 'cPanel Webmail alternativo seguro (HTTPS)' },
    { port: 8443, service: 'Plesk seguro (HTTPS)' },
    { port: 2484, service: 'Oracle DB SSL' },
    { port: 636, service: 'LDAP sobre SSL (LDAPS)' },

  ]
};
  
  const portsWeb={
    name: 'web',
    description: 'Puertos relacionados con servicios HTTP/HTTPS y paneles web',
    ports: [
  { port: 80, service: 'HTTP' },
  { port: 443, service: 'HTTPS' },
  { port: 8080, service: 'HTTP alternativo' },

    ]
  };

  const sistemOperativo={
    name: 'sistem',
    description: 'Puertos relacionados con sistemas operativos y servicios de infraestructura',
    ports: [
    { port: 22, service: 'Linux SSH' },
    { port: 3389, service: 'Windows Remote Desktop Protocol (RDP)/Remote Desktop Services(RDS)' },
    
    ]
  };
  


  const portPanels={
    name: 'panel',
    description: 'Puertos relacionados con paneles de control',
    ports:[
  { port: 2082, service: 'cPanel (no seguro)' },
  { port: 2083, service: 'cPanel (seguro)' },
  { port: 2086, service: 'cPanel (no seguro - WHM)' },
  { port: 2087, service: 'cPanel (seguro - WHM)' },
  { port: 8443, service: 'Plesk (seguro)' },
  { port: 8880, service: 'Plesk (no seguro)' },
    ]
  };
  
  const portsDatabase={
    name: 'db',
    description: 'Puertos utilizados por bases de datos',
    ports: [
      { port: 1433, service: 'Microsoft SQL Server' },
      { port: 1521, service: 'Oracle DB' },
      { port: 2483, service: 'Oracle DB (TCP)' },
      { port: 2484, service: 'Oracle DB (SSL)' },
      { port: 3306, service: 'MySQL/MariaDB' },
      { port: 5432, service: 'PostgreSQL' },
      { port: 27017, service: 'MongoDB' },
      { port: 6379, service: 'Redis' }
    ]
  };

  const portsRemoteAccess={
    name: 'remote',
    description: 'Puertos para administración y acceso remoto',
    ports: [

      { port: 23, service: 'Telnet' },
      { port: 5900, service: 'VNC' },
      {port:5985, service: 'WinRM - Windows Remote Management'},
      {port: 5986, service: 'WinRM - Windows Remote Managment (SSL)'},
    ]
  }
  
  const portsFileTransfer={
    name: 'ftp',
    description: 'Puertos relacionados con servicios de transferencia de archivos',
    ports: [
      { port: 20, service: 'FTP (Data)' },
      { port: 21, service: 'FTP (Control)' },
      { port: 115, service: 'SFTP' },
      { port: 69, service: 'TFTP' }
    ]
  };

  const portsRed=
    {
      name: 'red',
      description: 'Puertos relacionados con redes locales, compartición y servicios de infraestructura',
      ports: [
        { port: 445, service: 'SMB' },
        { port: 135, service: 'RPC' },
        { port: 137, service: 'NetBIOS Name' },
        { port: 138, service: 'NetBIOS Datagram' },
        { port: 139, service: 'NetBIOS Session' },
        { port: 161, service: 'SNMP' },
        { port: 162, service: 'SNMP Trap' },
        { port: 2049, service: 'NFS' }
      ]
    };

    const portPrint=
    {
      name: 'print',
      description: 'Puertos relacionados con la impresora y servicios de impresion',
      ports:[
        { port: 137, service: 'NetBIOS Name' },
         { port: 139, service: 'NetBIOS Session' },
          { port: 445, service: 'SMB (Server Message Block)' },
         { port: 515, service: 'LPD/LPR (Line Printer Daemon)' },
         {port: 631, service: 'IPP - Internet Printing Protocol'},
        { port: 3389, service: 'Windows Remote Desktop Protocol/Services (RDP/RDS)' },
          {port: 9100, service:'RAW Printing Port'},
      ]
    }
  


  const portsInfra={
    name: 'infra',
    description: 'Servicios esenciales de red e infraestructura',
    ports: [
      { port: 53, service: 'DNS' },
      { port: 67, service: 'DHCP (Server)' },
      { port: 68, service: 'DHCP (Client)' },
      { port: 123, service: 'NTP' },
      { port: 514, service: 'Syslog' },
      { port: 389, service: 'LDAP estándar (sin cifrado)' }, 
    ]
  };

  const portsOther={
    name: 'other',
    description: 'Otros servicios menos comunes o específicos',
    ports: [
      { port: 194, service: 'IRC' }
    ]
  };

  const portGroups = {
  
    email: portsEmail,
    sistem: sistemOperativo,
    web: portsWeb,
    panel: portPanels,
    print:portPrint,
    db: portsDatabase,
    remote: portsRemoteAccess,
    ftp: portsFileTransfer,
    red: portsRed,
    infra: portsInfra,
    ssl: portsSSL,
    other: portsOther
    // Aquí podés agregar más grupos como "ftp", "red", etc.
    // Ejemplo: ftp: portsFileTransfer,
  };


  const knownPortsServices = generateListAllPorts(portGroups);

  
  
  module.exports = { portGroups, knownPortsServices };