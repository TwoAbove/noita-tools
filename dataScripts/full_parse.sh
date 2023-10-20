mkdir src/out
mkdir src/out/obj
mkdir src/out/gen

NOLLA_PATH=~/.steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/data

find $NOLLA_PATH -type f -exec sed -i 's/----------------------//g' {} +
find $NOLLA_PATH -type f -exec sed -i 's/<!------------ MATERIALS -------------------->/<!-- MATERIALS -->/g' {} +
find $NOLLA_PATH -type f -exec sed -i 's/<!------------ MATERIALS ------------------ -->/<!-- MATERIALS -->/g' {} +
find $NOLLA_PATH -type f -exec sed -i 's/<!-- attack_ranged_min_distance="60" -->//g' {} +
find $NOLLA_PATH -type f -exec sed -i 's/<!---------------- shield ---------------- -->//g' {} +
find $NOLLA_PATH -type f -exec sed -i 's/<!-- fuse_tnt durability is 11 so this is capable of destroying it -->//g' {} +

ts-node ./src/generateMaterials.ts
ts-node ./src/generateSpells.ts
ts-node ./src/spellsToProbs.ts
ts-node ./src/generatePerks.ts
ts-node ./src/mapsToObj

# Ask if you want to copy the files to the game directory
read -p "Do you want to copy the files to the data directory? (y/n) " -n 1 -r

if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -r ./src/out/gen # Not needed
  mv -rf ./src/out/spells.h ../src/services/SeedInfo/noita_random/src/spells.h
  cp -rf ./src/out/* ../src/services/SeedInfo/data/
fi

echo "Done!"
