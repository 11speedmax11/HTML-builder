const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const distFile = path.join(distDir, 'bundle.css');

fs.readdir(stylesDir, (err, files) => {
  if (err) throw err;

  const cssFiles = fs.readdirSync(stylesDir).filter(file => path.extname(file) === '.css');

  let bundleContent = '';

  cssFiles.forEach(file => {
    const filePath = path.join(stylesDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    bundleContent += fileContent + '\n';
  });

  fs.writeFile(distFile, bundleContent, err => {
    if (err) throw err;
    console.log('Стили успешно объединены!');
  });
});