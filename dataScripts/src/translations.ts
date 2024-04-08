import fs from "fs";
import path from "path";
import Jimp from "jimp";
import { parse } from "csv-parse/sync";

import { homedir } from "os";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const translationFile = path.resolve(__dirname, "../noita-data/translations/common.csv");

const translationCSV = fs.readFileSync(translationFile).toString();

const translation: { [locale: string]: { [id: string]: string } } = {};

// first col is id
// eslint-disable-next-line no-sparse-arrays
const locales = [, "en", "ru", "pt-br", "es-es", "de", "fr-fr", "it", "pl", "zh-cn", "jp", "ko"];
const localeMap = {
  en: "en",
  ru: "ru",
  "pt-br": "pt",
  "es-es": "es",
  de: "de",
  "fr-fr": "fr",
  it: "it",
  pl: "pl",
  "zh-cn": "zh",
  jp: "jp",
  ko: "ko",
};
const records: any[] = parse(translationCSV, {
  // columns: true,
  skip_empty_lines: true,
});

records.forEach((row, i) => {
  // if (!i) {
  // csv col definitions
  // return;
  // }
  // const items = row.split(',');

  for (let i = 1; i < locales.length; i++) {
    const locale = locales[i];
    if (!locale) {
      continue;
    }
    if (!translation[locale]) {
      translation[locale] = {};
    }
    translation[locale]["$" + row[0]] = row[i];
  }
});

fs.mkdirSync(path.resolve(__dirname, `./out/locales`));
for (let i = 1; i < locales.length; i++) {
  const locale = locales[i];
  if (!locale) {
    continue;
  }
  const localeName = localeMap[locale];
  fs.mkdirSync(path.resolve(__dirname, `./out/locales/${localeName}`), { recursive: true });
  fs.writeFileSync(path.resolve(__dirname, `./out/locales/${localeName}/app.json`), JSON.stringify({}, null, 2));
  fs.writeFileSync(
    path.resolve(__dirname, `./out/locales/${localeName}/materials.json`),
    JSON.stringify(translation[locale], null, 2),
  );
}
