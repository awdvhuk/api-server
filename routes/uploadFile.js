const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const readline = require('readline');
const upload = multer({ dest: './public/uploads/csv/' });
const { exec } = require('child_process');

router.post('/', upload.single('file'), function (req, res) {
  if (!req.file) {
    return res.send('nothing');
  }
  const { io } = req.app;

  let percent;

  exec(`wc -l ./public/uploads/csv/${req.file.filename}`, (err, stdout, stderr) => {
    if (err) {
      console.log(`err: ${err}`);
      return res.send('File error');
    }

    percent = +stdout.split(' ')[2] / 100;
    let progress = 0;

    readStreem = fs.createReadStream(`public/uploads/csv/${req.file.filename}`);

    const lineReader = readline.createInterface({
      input: readStreem
    });

    let lineNumber = 0;
    let error = false;

    lineReader.on('line', async function (line) {
      lineReader.pause();

      lineNumber++;
      let check = lineParser(line, lineNumber);
      if (check !== true) {
        io.emit('error', check);
        console.log(check);
        error = true;
      }
      if (lineNumber >= progress + percent) {
        progress += percent;
        io.emit('dataCheck', 'next');
      }
      
      await sleep(300);
      lineReader.resume();
    }
    );

    lineReader.input
      .on('open', function () {
        console.log(`start read --- public/uploads/csv/${req.file.filename}`);
      })
      .on('error', (err) => {
        console.log(`file read error (public/uploads/csv/${req.file.filename}):`, err);
        return res.send('File error');
      })
      .on('end', () => {
        console.log(`end read --- public/uploads/csv/${req.file.filename}`);
        return res.send(!error);
      });

    fs.unlinkSync(`public/uploads/csv/${req.file.filename}`);
  });
});

module.exports = router;

const lineParser = (line, number) => {
  let arr = [];
  let startID = 0;
  for (let i = 0; i < line.length; i++) {
    if (
      line[i] === ',' &&
      line[i + 1] !== ` ` &&
      line[i - 1] !== ` ` &&
      line[i + 1] !== `"` &&
      line[i - 1] !== `"`
    ) {
      arr.push(line.substr(startID, i - startID));
      startID = i + 1;
    }

    if (line.substr(startID, i - startID) === `""`) {
      arr.push(line.substr(startID, i - startID));
      startID = i + 1;
      continue;
    }

    if (line[i - 1] !== ' ' && line[i - 1] !== `"` && line[i] === ',' && line[i + 1] === `"`) {
      arr.push(line.substr(startID, i - startID));
      startID = i + 1;
      let res = commasValid(line, i);
      if (res.valid) {
        i = res.id;
        arr.push(line.substr(startID, i - startID));
        startID = i + 1;
        continue;
      }
      else {
        return `Error on line № ${number}`;
      }
    }

    if (line[i - 1] === `"` && line[i] === ',' && line[i + 1] !== ' ') {
      return `Error on line № ${number}`;
    }

    if (i === line.length - 1) {
      arr.push(line.substr(startID));
    }
  }

  return lineValidCheck(arr, number);
}

const lineValidCheck = (line, number) => {
  if (
    line.length !== 5 ||
    line[0].length !== 4 || !isNumeric(line[0]) ||
    !isNumeric(line[4]) || line[4][4] !== '.'
  ) {
    return `Error on line № ${number}`;
  }
  return true;
}

const commasValid = (line, startID) => {
  for (let i = startID + 2; i < line.length; i++) {
    if (
      line[i - 1] !== ' ' &&
      line[i] === ',' &&
      line[i + 1] === `"`
    ) {
      return { valid: false };
    }
    if (
      line[i] === `"` &&
      line[i + 1] === ',' &&
      line[i + 2] !== ' '
    ) {
      return { valid: true, id: i + 1 };
    }
  }
  return { valid: false };
}

const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function sleep(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
    
}
