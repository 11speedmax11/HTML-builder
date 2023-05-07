const fileSystem = require("fs");
const fs = fileSystem.promises;
const path = require('path');

const src = path.join(__dirname, '../06-build-page');
const dest = path.join(__dirname, '../06-build-page/project-dist');
const writeStream = fileSystem.createWriteStream(dest + "/style.css");


async function createProject(dest) {
  fileSystem.rmdir(dest, () => { });  //Удаляем старую папку, если есть
  await fs.mkdir(dest, { recursive: true }, (error) => { if (error) throw error; })
  createFiles(src + `/assets/`, dest + `/assets/`);
  createStyle(src + `/styles/`);
  const writeHtmlStream = fileSystem.createWriteStream(dest + "/index.html");
  createHTML(src).then((item) => writeHtmlStream.write(item, "UTF8"));
  console.log("готово");
};

function createFiles(src, dest) {
  fileSystem.readdir(src, { withFileTypes: true }, (error, fileNames) => {
    fileNames.forEach(fileitem => {
      if (fileitem.isDirectory()) {
        fs.mkdir(`${dest}/${fileitem.name}`, { recursive: true }, (error) => { if (error) throw error; })
          .then(() => {
            createFiles(`${src}/${fileitem.name}`, `${dest}/${fileitem.name}`, (error) => { if (error) throw error });
          })
      } else {
        fileSystem.copyFile(`${src}/${fileitem.name}`, `${dest}/${fileitem.name}`, (error) => { if (error) throw error });
      }
    })
  });

}
let data = '';

async function createStyle(src) {
  const fileNames = await fs.readdir(src);
  fileNames.forEach((fileitem) => {
    if (path.parse(src + fileitem).ext == '.css') {
      fs.readFile(src + fileitem, 'utf8')
        .then((item) => {
          data += item;
          writeStream.write(data, "UTF8");
        });
    }
  });
}

async function createHTML(src) { 

  let template = await fs.readFile(src + '/template.html', 'utf8');
  const fileNames = await fs.readdir(src + `/components/`);

  for (const fileItem of fileNames) {
    if (path.parse(src + `/components/` + fileItem).ext == '.html') {
      let fName = path.parse(src + `/components/` + fileItem).name;
      const regex = new RegExp(`{{${fName}}}`);
      const content = await fs.readFile(src + `/components/` + fileItem, 'utf8')
      template = template.replace(regex, content);
    }
  }
  return template
};

createProject(dest);