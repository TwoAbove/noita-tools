#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <optional>

#include "../../../noita_random/src/noita_random.cpp"

struct FungalTransformation
{
  bool flaskTo;
  bool flaskFrom;
  std::vector<std::string> from;
  std::string to;
  std::string gold_to_x;
  std::string grass_to_x;
};

struct MaterialItemFrom
{
  double probability;
  std::vector<std::string> materials;
  std::optional<std::string> name_material;
};

vector<MaterialItemFrom> materials_from = {
    {1.0,
     {"water", "water_static", "water_salt", "water_ice"},
     "water"},
    {
        1.0,
        {"lava"},
    },
    {1.0,
     {"radioactive_liquid", "poison", "material_darkness"},
     "radioactive_liquid"},
    {1.0,
     {"oil", "swamp", "peat"},
     "oil"},
    {
        1.0,
        {"blood"},
    },
    {1.0,
     {"blood_fungi", "fungi", "fungisoil"},
     "fungi"},
    {
        1.0,
        {"blood_cold", "blood_worm"},
    },
    {
        1.0,
        {"acid"},
    },
    {0.4,
     {"acid_gas",
      "acid_gas_static",
      "poison_gas",
      "fungal_gas",
      "radioactive_gas",
      "radioactive_gas_static"},
     "acid_gas"},
    {0.4,
     {"magic_liquid_polymorph", "magic_liquid_unstable_polymorph"},
     "magic_liquid_polymorph"},
    {
        0.4,
        {"magic_liquid_berserk", "magic_liquid_charm", "magic_liquid_invisibility"},
    },
    {
        0.6,
        {"diamond"},
    },
    {
        0.6,
        {"silver", "brass", "copper"},
    },
    {
        0.2,
        {"steam", "smoke"},
    },
    {
        0.4,
        {"sand"},
    },
    {
        0.4,
        {"snow_sticky"},
    },
    {
        0.05,
        {"rock_static"},
    },
    {0.0003,
     {"gold", "gold_box2d"},
     "gold"},
};

struct MaterialItemTo
{
  double probability;
  std::string material;
};

vector<MaterialItemTo> materials_to = {
    {1.0,
     "water"},
    {1.0,
     "lava"},
    {1.0,
     "radioactive_liquid"},
    {1.0,
     "oil"},
    {1.0,
     "blood"},
    {1.0,
     "blood_fungi"},
    {1.0,
     "acid"},
    {1.0,
     "water_swamp"},
    {1.0,
     "alcohol"},
    {1.0,
     "sima"},
    {1.0,
     "blood_worm"},
    {1.0,
     "poison"},
    {1.0,
     "vomit"},
    {1.0,
     "pea_soup"},
    {1.0,
     "fungi"},
    {0.8,
     "sand"},
    {0.8,
     "diamond"},
    {0.8,
     "silver"},
    {0.8,
     "steam"},
    {0.5,
     "rock_static"},
    {0.5,
     "gunpowder"},
    {0.5,
     "material_darkness"},
    {0.5,
     "material_confusion"},
    {0.2,
     "rock_static_radioactive"},
    {0.02,
     "magic_liquid_polymorph"},
    {0.02,
     "magic_liquid_random_polymorph"},
    {0.15,
     "magic_liquid_teleportation"},
    {0.10,
     "mimic_liquid"},
    {0.01,
     "urine"},
    {0.01,
     "poo"},
    {0.01,
     "void_liquid"},
    {0.01,
     "cheese_static"},
};

std::vector<std::string> greedy_materials =
    {
        "brass",
        "silver",
        "radioactive_liquid",
        "pea_soup",
        "acid_gas",
        "poo",
        "mammi",
        "rotten_meat_radioactive",
        "vomit",
};

std::vector<FungalTransformation>
PickForSeed(uint ws, int maxShifts = 20)
{
  const bool debug_no_limits = false;

  std::vector<FungalTransformation> shifts;

  if (maxShifts == -1)
  {
    maxShifts = 20;
  }

  NollaPrng randoms = NollaPrng(0);

  for (int iter = 0; iter < maxShifts; iter++)
  {
    int convert_tries = 0;
    bool converted_any = false;

    while (converted_any == false && convert_tries < 20)
    {
      int seed2 = 42345 + iter + 1000 * convert_tries;
      random_pos rnd{9123, seed2};
      randoms.SetRandomSeed(ws, 89346, seed2);

      MaterialItemFrom from = pick_random_from_table_weighted<MaterialItemFrom>(ws, rnd, materials_from);
      MaterialItemTo to = pick_random_from_table_weighted<MaterialItemTo>(ws, rnd, materials_to);

      bool flaskFrom = false;
      bool flaskTo = false;
      std::string gold_to_x = "gold";
      std::string grass_to_x = "grass_holy";
      if (random_next(ws, rnd, 1, 100) <= 75)
      {
        if (random_next(ws, rnd, 1, 100) <= 50)
        {
          flaskFrom = true;
        }
        else
        {
          flaskTo = true;
          if (random_next(ws, rnd, 1, 1000) != 1)
          {
            gold_to_x = randoms.random_from_array(greedy_materials);
            grass_to_x = "grass";
          }
        }
      }

      std::vector<std::string> from_materials;
      std::string to_material = to.material;
      for (const auto &it : from.materials)
      {
        auto from_len = from_materials.size();
        if (from_len == 0 || it != to_material)
        {
          from_materials.push_back(it);
          converted_any = true;
        }
      }

      shifts.push_back({flaskTo, flaskFrom, from_materials, to_material, gold_to_x, grass_to_x});

      convert_tries++;
    }
  }

  return shifts;
}

#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(noitool_fungal)
{
  register_vector<std::string>("VectorString");
  value_object<FungalTransformation>("FungalTransformation")
      .field("flaskTo", &FungalTransformation::flaskTo)
      .field("flaskFrom", &FungalTransformation::flaskFrom)
      .field("from", &FungalTransformation::from)
      .field("to", &FungalTransformation::to)
      .field("gold_to_x", &FungalTransformation::gold_to_x)
      .field("grass_to_x", &FungalTransformation::grass_to_x);
  register_vector<FungalTransformation>("VectorFungalTransformation");
  emscripten::function("PickForSeed", &PickForSeed);
}
