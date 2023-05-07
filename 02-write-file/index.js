const fs = require('fs');
const path = require('path');
const process = require('node:process');
const {stdin, stdout} = process;

const stream = fs.createWriteStream(path.join(__dirname, 'destination.txt'));

stdout.write('Введите текст:\n');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    stdout.write('Ввод завершен');
    process.exit();
  }
  else {
    stream.write(data, 'utf-8');
  }
});

process.addListener('SIGINT', ()=> {
  stdout.write('Ввод завершен');
  process.exit();  
});

