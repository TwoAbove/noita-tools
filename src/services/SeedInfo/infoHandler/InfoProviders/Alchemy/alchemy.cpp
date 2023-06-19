#include "../../../noita_random/src/noita_random.cpp"

class MaterialPicker
{
public:
  vector<string> LIQUIDS = {
      "acid", "alcohol", "blood",
      "blood_fungi", "blood_worm", "cement",
      "lava", "magic_liquid_berserk", "magic_liquid_charm",
      "magic_liquid_faster_levitation", "magic_liquid_faster_levitation_and_movement", "magic_liquid_invisibility",
      "magic_liquid_mana_regeneration", "magic_liquid_movement_faster", "magic_liquid_protection_all",
      "magic_liquid_teleportation", "magic_liquid_unstable_polymorph", "magic_liquid_unstable_teleportation",
      "magic_liquid_worm_attractor", "material_confusion", "mud",
      "oil", "poison", "radioactive_liquid_yellow",
      "swamp", "urine", "water",
      "water_ice", "water_swamp", "magic_liquid_random_polymorph"};

  vector<string> ALCHEMY = {
      "bone_box2d", "brass", "coal",
      "copper", "diamond", "fungi",
      "gold", "grass", "gunpowder",
      "gunpowder_explosive", "rotten_meat", "sand_petrify",
      "silver", "slime", "snow_b2",
      "soil", "wax", "honey"};

  NollaPrng *PRNG;

  vector<string> Materials = {};

  MaterialPicker(NollaPrng *prng, uint worldSeed)
  {
    PRNG = prng;
    PickMaterials(LIQUIDS, 3);
    PickMaterials(ALCHEMY, 1);
    ShuffleList(worldSeed);
    PRNG->Next();
    PRNG->Next();
  }

  void PickMaterials(vector<string> source, int count)
  {
    int counter = 0;
    int failed = 0;
    while (counter < count && failed < 99999)
    {
      int rand = (int)(PRNG->Next() * (double)source.size());
      string picked = source[rand];
      if (std::find(Materials.begin(), Materials.end(), picked) == Materials.end())
      {
        Materials.push_back(picked);
        counter++;
      }
      else
      {
        failed++;
      }
    }
    return;
  }

  void ShuffleList(uint worldSeed)
  {
    NollaPrng *prng = new NollaPrng((worldSeed >> 1) + 12534);

    for (int i = Materials.size() - 1; i >= 0; i--)
    {
      int rand = prng->Next() * (double)(i + 1);
      string tmp = Materials[i];
      Materials[i] = Materials[rand];
      Materials[rand] = tmp;
    }
    delete prng;
  }
};

static string PickForSeed(uint world_seed)
{
  NollaPrng *prng = new NollaPrng((world_seed * 0.17127000) + 1323.59030000);
  // Preheat random!
  for (int i = 0; i < 5; i++)
  {
    prng->Next();
  }

  MaterialPicker *lc = new MaterialPicker(prng, world_seed);
  string slc = "lc:" + lc->Materials[0] + "," + lc->Materials[1] + "," + lc->Materials[2]; // + "," + lc->Materials[3];
  MaterialPicker *ap = new MaterialPicker(prng, world_seed);
  string sap = "ap:" + ap->Materials[0] + "," + ap->Materials[1] + "," + ap->Materials[2]; // + "," + ap->Materials[3];

  delete prng;
  delete lc;
  delete ap;

  return slc + ";" + sap;
}

#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(noitool_alchemy)
{
  emscripten::function<string>("PickForSeed", &PickForSeed);
}
