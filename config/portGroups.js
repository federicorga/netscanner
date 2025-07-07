const { knownPortsServices } = require("./portsConfig");



const portAll={
  name: 'all',
  description: 'Todos los puertos conocidos y sus servicios asociados',
  ports: knownPortsServices,
}



const portsEmail={
    name: 'email',
    description: 'Puertos relacionados con servicios de correo electrónico',
    ports: [
      { port: 25, name: 'SMTP' },
      { port: 465, name: 'SMTPS' },
      { port: 587, name: 'SMTP (submission)' },
      { port: 110, name: 'POP3' },
      { port: 995, name: 'POP3S' },
      { port: 143, name: 'IMAP' },
      { port: 993, name: 'IMAPS' },
      { port: 2095, name: 'cPanel (no seguro - Webmail)' },
      { port: 2096, name: 'cPanel (seguro - Webmail standar)' },
      {port: 32001, name: 'Webmail alternativo (seguro)'},

    ]
  };

  
  const portsWeb={
    name: 'web',
    description: 'Puertos relacionados con servicios HTTP/HTTPS y paneles web',
    ports: [
  { port: 80, name: 'HTTP' },
  { port: 443, name: 'HTTPS' },
  { port: 8080, name: 'HTTP alternativo' },

    ]
  };

  const sistemOperativo={
    name: 'sistem',
    description: 'Puertos relacionados con sistemas operativos y servicios de infraestructura',
    ports: [
    { port: 22, name: 'Linux SSH' },
    { port: 3389, name: 'Windows Remote Desktop Protocol (RDP)/Remote Desktop Services(RDS)' },
    ]
  };
  


  const portPanels={
    name: 'panel',
    description: 'Puertos relacionados con paneles de control',
    ports:[
        { port: 2082, name: 'cPanel (no seguro)' },
  { port: 2083, name: 'cPanel (seguro)' },
  { port: 2086, name: 'cPanel (no seguro - WHM)' },
  { port: 2087, name: 'cPanel (seguro - WHM)' },
  { port: 8443, name: 'Plesk (seguro)' },
  { port: 8880, name: 'Plesk (no seguro)' },
    ]
  };
  
  const portsDatabase={
    name: 'db',
    description: 'Puertos utilizados por bases de datos',
    ports: [
      { port: 1433, name: 'Microsoft SQL Server' },
      { port: 1521, name: 'Oracle DB' },
      { port: 2483, name: 'Oracle DB (TCP)' },
      { port: 2484, name: 'Oracle DB (SSL)' },
      { port: 3306, name: 'MySQL/MariaDB' },
      { port: 5432, name: 'PostgreSQL' },
      { port: 27017, name: 'MongoDB' },
      { port: 6379, name: 'Redis' }
    ]
  };

  const portsRemoteAccess={
    name: 'remote',
    description: 'Puertos para administración y acceso remoto',
    ports: [

      { port: 23, name: 'Telnet' },
      { port: 5900, name: 'VNC' }
    ]
  }
  
  const portsFileTransfer={
    name: 'ftp',
    description: 'Puertos relacionados con servicios de transferencia de archivos',
    ports: [
      { port: 20, name: 'FTP (Data)' },
      { port: 21, name: 'FTP (Control)' },
      { port: 115, name: 'SFTP' },
      { port: 69, name: 'TFTP' }
    ]
  };

  const portsRed=
    {
      name: 'red',
      description: 'Puertos relacionados con redes locales, compartición y servicios de infraestructura',
      ports: [
        { port: 445, name: 'SMB' },
        { port: 135, name: 'RPC' },
        { port: 137, name: 'NetBIOS Name' },
        { port: 138, name: 'NetBIOS Datagram' },
        { port: 139, name: 'NetBIOS Session' },
        { port: 161, name: 'SNMP' },
        { port: 162, name: 'SNMP Trap' },
        { port: 2049, name: 'NFS' }
      ]
    };

    const portPrint=
    {
      name: 'print',
      description: 'Puertos relacionados con la impresora y servicios de impresion',
      ports:[
        { port: 137, name: 'NetBIOS Name' },
         { port: 139, name: 'NetBIOS Session' },
          { port: 445, name: 'SMB (Server Message Block)' },
         { port: 515, name: 'LPD/LPR (Line Printer Daemon)' },
         {port: 631, name: 'IPP - Internet Printing Protocol'},
        { port: 3389, name: 'Windows Remote Desktop Protocol/Services (RDP/RDS)' },
          {port: 9100, name:'RAW Printing Port'},
      ]
    }
  


  const portsInfra={
    name: 'infra',
    description: 'Servicios esenciales de red e infraestructura',
    ports: [
      { port: 53, name: 'DNS' },
      { port: 67, name: 'DHCP (Server)' },
      { port: 68, name: 'DHCP (Client)' },
      { port: 123, name: 'NTP' },
      { port: 514, name: 'Syslog' }
    ]
  };

  const portsOther={
    name: 'other',
    description: 'Otros servicios menos comunes o específicos',
    ports: [
      { port: 194, name: 'IRC' }
    ]
  };

  const portGroups = {
    all: portAll,
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
    other: portsOther
    // Aquí podés agregar más grupos como "ftp", "red", etc.
    // Ejemplo: ftp: portsFileTransfer,
  };

  
  
  module.exports = { portGroups };