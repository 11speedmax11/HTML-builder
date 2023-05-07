const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        const fileSizeInBytes = stats.size;
        const fileSizeInKB = fileSizeInBytes / 1024;
        const fileExtension = path.extname(file);
        const fileName = path.basename(file, fileExtension);
        console.log(`${fileName}-${fileExtension}-${fileSizeInKB.toFixed(3)}kb`);
      }
    });
  });
});