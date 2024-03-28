#! /bin/bash
set -x

rm -r src/out
mkdir src/out
mkdir src/out/obj
mkdir src/out/gen

echo "Generating files"

tsx ./src/translations.ts
tsx ./src/generateMaterials.ts
tsx ./src/generateSpells.ts
tsx ./src/spellsToProbs.ts
tsx ./src/generatePerks.ts
tsx ./src/mapsToObj

echo "Done!"

# Ask if you want to copy the files to the game directory
read -p "Do you want to copy the files to the data directory? (y/N) " -n 1 -r

if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -r ./src/out/gen # Not needed - need manual updates since these are templates
  mv -f ./src/out/spells.h ../src/services/SeedInfo/noita_random/src/spells.h
  mv ./src/out/locales ../public/locales

  cp -rf ./src/out/* ../src/services/SeedInfo/data/
fi

echo "Done!"
