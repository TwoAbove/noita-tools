import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

const noitaData = path.resolve(require('os').homedir(), '.steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/'
);
const translationFile = path.resolve(require('os').homedir(), '.steam/debian-installation/steamapps/common/Noita/data/translations/common.csv'
);

const translationCSV = fs.readFileSync(translationFile).toString();

const translation: { [locale: string]: { [id: string]: string } } = {};

// first col is id
// eslint-disable-next-line no-sparse-arrays
const locales = [, 'en', 'ru', 'pt-br', 'es-es', 'de', 'fr-fr', 'it', 'pl', 'zh-cn', 'jp', 'ko'];

translationCSV.split('\n').forEach((row, i) => {
  if (!i) {
    // csv col definitions
    return;
  }
  const items = row.split(',');

  for (let i = 1; i < locales.length; i++) {
    const locale = locales[i];
    if (!locale) {
      continue;
    }
    if (!translation[locale]) {
      translation[locale] = {};
    }
    translation[locale]["$" +items[0]] = items[i];
  }

});

fs.mkdirSync(path.resolve(__dirname, `./locales`));
for (let i = 1; i < locales.length; i++) {
  const locale = locales[i];
  if (!locale) {
    continue;
  }
  fs.mkdirSync(path.resolve(__dirname, `./locales/${locale}`));
  fs.writeFileSync(path.resolve(__dirname, `./locales/${locale}/materials.json`), JSON.stringify(translation[locale], null, 2));
}
