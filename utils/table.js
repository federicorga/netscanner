const chalk = require('chalk');

function printCustomTable(data, options = {}) {
  const {
    headerColor = chalk.bold.white,
    borderColor = chalk.gray,
    valueColor = chalk.white,
    campoColor = chalk.cyan,
    descripcionColor = chalk.dim
  } = options;

  const maxCampo = Math.max(...data.map(d => d.Campo.length), 'Campo'.length) + 2;
  const maxValor = Math.max(...data.map(d => d.Valor.length), 'Valor'.length) + 2;
  const hasDescripcion = data.some(d => d.Descripcion);

  const maxDesc = hasDescripcion
    ? Math.max(...data.map(d => (d.Descripcion || '').length), 'Descripción'.length) + 2
    : 0;

  const lineTop = hasDescripcion
    ? `┌${'─'.repeat(maxCampo + 1)}┬${'─'.repeat(maxValor + 1)}┬${'─'.repeat(maxDesc + 1)}┐`
    : `┌${'─'.repeat(maxCampo + 1)}┬${'─'.repeat(maxValor + 1)}┐`;

  const lineMiddle = hasDescripcion
    ? `├${'─'.repeat(maxCampo + 1)}┼${'─'.repeat(maxValor + 1)}┼${'─'.repeat(maxDesc + 1)}┤`
    : `├${'─'.repeat(maxCampo + 1)}┼${'─'.repeat(maxValor + 1)}┤`;

  const lineBottom = hasDescripcion
    ? `└${'─'.repeat(maxCampo + 1)}┴${'─'.repeat(maxValor + 1)}┴${'─'.repeat(maxDesc + 1)}┘`
    : `└${'─'.repeat(maxCampo + 1)}┴${'─'.repeat(maxValor + 1)}┘`;

  // Encabezado
  console.log(borderColor(lineTop));
  console.log(
    hasDescripcion
      ? `│ ${headerColor('Campo'.padEnd(maxCampo))}│ ${headerColor('Valor'.padEnd(maxValor))}│ ${headerColor('Descripción'.padEnd(maxDesc))}│`
      : `│ ${headerColor('Campo'.padEnd(maxCampo))}│ ${headerColor('Valor'.padEnd(maxValor))}│`
  );
  console.log(borderColor(lineMiddle));

  // Filas
  data.forEach(({ Campo, Valor, Descripcion }) => {
    const campoText = campoColor(Campo.padEnd(maxCampo));
    const valorText = valueColor(Valor.padEnd(maxValor));

    if (hasDescripcion) {
      const descText = descripcionColor((Descripcion || '').padEnd(maxDesc));
      console.log(`│ ${campoText}│ ${valorText}│ ${descText}│`);
    } else {
      console.log(`│ ${campoText}│ ${valorText}│`);
    }
  });

  console.log(borderColor(lineBottom));
}

module.exports = { printCustomTable };
