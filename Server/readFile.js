const { once } = require('events');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');

async function processLineByLine() {
  try {
    let linesArr = [];
    const rl = createInterface({
      input: createReadStream('logfile.log'),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      linesArr.push(line);
    });

    await once(rl, 'close');

    return linesArr;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
    processLineByLine
}