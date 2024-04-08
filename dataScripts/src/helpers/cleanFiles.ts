// NOLLA_PATH=./noita_data/data

// find $NOLLA_PATH -type f -exec sed -i 's/----------------------//g' {} +
// find $NOLLA_PATH -type f -exec sed -i 's/<!------------ MATERIALS -------------------->/<!-- MATERIALS -->/g' {} +
// find $NOLLA_PATH -type f -exec sed -i 's/<!------------ MATERIALS ------------------ -->/<!-- MATERIALS -->/g' {} +
// find $NOLLA_PATH -type f -exec sed -i 's/<!-- attack_ranged_min_distance="60" -->//g' {} +
// find $NOLLA_PATH -type f -exec sed -i 's/<!---------------- shield ---------------- -->//g' {} +
// find $NOLLA_PATH -type f -exec sed -i 's/<!-- fuse_tnt durability is 11 so this is capable of destroying it -->//g' {} +

import fs from "fs";

export type FileType = "xml" | "lua";

const fileFixes = {
  "data/entities/misc/eradicate.xml": (xml: string) => {
    // Need to close the root tag by replacing the last <Entity> with </Entity>
    const nonRoot = xml.replaceAll("<Entity>", "");
    return `<Entity>${nonRoot}</Entity>`;
  },
};

export const getCleanedFile = (path: string, fallback?: string) => {
  try {
    let data = fs.readFileSync(path).toString();

    const fixPath = Object.keys(fileFixes).find(k => path.endsWith(k));

    if (fixPath) {
      data = fileFixes[fixPath](data);
    }

    const cleaned = data
      .replace(/----------------------/g, "")
      .replace(/<!------------ MATERIALS -------------------->/g, "<!-- MATERIALS -->")
      .replace(/<!------------ MATERIALS ------------------ -->/g, "<!-- MATERIALS -->")
      .replace(/<!-- attack_ranged_min_distance="60" -->/g, "")
      .replace(/<!---------------- shield ---------------- -->/g, "")
      .replace(/<!-- fuse_tnt durability is 11 so this is capable of destroying it -->/g, "");

    return cleaned;
  } catch (e) {
    console.error(`Could not read ${path}:`, e);
    if (fallback || fallback === "") {
      return fallback;
    }
    throw e;
  }
};
