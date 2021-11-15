// Thanks to kaliuresis!
// Check out his orb atlas repository: https://github.com/kaliuresis/noa
#include <stdint.h>
#include <math.h>
#include <string>
#include <iterator>
#include <vector>
#include <algorithm>
#include <numeric>
#include <functional>
#include <limits.h>

typedef unsigned int uint;

typedef uint8_t byte;
typedef int8_t int8;
typedef int16_t int16;
typedef int32_t int32;
typedef int64_t int64;
typedef uint8_t uint8;
typedef uint16_t uint16;
typedef uint32_t uint32;
typedef uint64_t uint64;
typedef uint8 bool8;

uint world_seed = 0;
double random_seed = 0;

using namespace std;

uint64 SetRandomSeedHelper(double r)
{
    uint64 e = *(uint64 *)&r;
    if (((e >> 0x20 & 0x7fffffff) < 0x7FF00000) && (-9.223372036854776e+18 <= r) && (r < 9.223372036854776e+18))
    {
        //should be same as e &= ~(1<<63); which should also just clears the sign bit,
        //or maybe it does nothing,
        //but want to keep it as close to the assembly as possible for now
        e <<= 1;
        e >>= 1;
        double s = *(double *)&e;
        uint64 i = 0;
        if (s != 0.0)
        {
            uint64 f = (((uint64)e) & 0xfffffffffffff) | 0x0010000000000000;
            uint64 g = 0x433 - ((uint64)e >> 0x34);
            uint64 h = f >> g;

            int j = -(uint)(0x433 < ((e >> 0x20) & 0xFFFFFFFF) >> 0x14);
            i = (uint64)j << 0x20 | j;
            i = ~i & h | f << (((uint64)s >> 0x34) - 0x433) & i;
            i = ~-(uint64)(r == s) & -i | i & -(uint64)(r == s);
            // error handling, whatever
            // f = f ^
            // if((int) g > 0 && f )
        }
        return i & 0xFFFFFFFF;
    }

    //error!
    uint64 error_ret_val = 0x8000000000000000;
    return *(double *)&error_ret_val;
}

uint SetRandomSeedHelper2(int param_1, int param_2, uint param_3)
{
    uint uVar1;
    uint uVar2;
    uint uVar3;

    uVar2 = (param_1 - param_2) - param_3 ^ param_3 >> 0xd;
    uVar1 = (param_2 - uVar2) - param_3 ^ uVar2 << 8;
    uVar3 = (param_3 - uVar2) - uVar1 ^ uVar1 >> 0xd;
    uVar2 = (uVar2 - uVar1) - uVar3 ^ uVar3 >> 0xc;
    uVar1 = (uVar1 - uVar2) - uVar3 ^ uVar2 << 0x10;
    uVar3 = (uVar3 - uVar2) - uVar1 ^ uVar1 >> 5;
    uVar2 = (uVar2 - uVar1) - uVar3 ^ uVar3 >> 3;
    uVar1 = (uVar1 - uVar2) - uVar3 ^ uVar2 << 10;
    return (uVar3 - uVar2) - uVar1 ^ uVar1 >> 0xf;
}

double Random(double a, double b)
{
    int iVar1;

    iVar1 = (int)random_seed * 0x41a7 + ((int)random_seed / 0x1f31d) * -0x7fffffff;
    if (iVar1 < 1)
    {
        iVar1 = iVar1 + 0x7fffffff;
    }
    random_seed = (double)iVar1;
    return a - ((b - a) * (double)iVar1 * -4.656612875e-10);
}

class NollaPrng
{
public:
    static const int SEED_BASE = 23456789 + 1 + 11 * 11;
    double Seed;

    NollaPrng(uint seed, int seedBase = SEED_BASE)
    {
        Seed = (double)(seedBase + seed);
        Next();
    }

    NollaPrng(double seed)
    {
        Seed = seed;
        Next();
    }

    NollaPrng() = default;

    double Next()
    {
        Seed = ((int)Seed) * 16807 + ((int)Seed) / 127773 * -INT_MAX;
        //it's abs+1, because M A G I C, damn it
        if (Seed < 0)
        {
            Seed += INT_MAX;
        }
        return Seed / INT_MAX;
    }
};

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
        "copper", "diamond", "fungus_loose",
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
            int rand = (int)(PRNG->Next() * source.size());
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
        NollaPrng *prng = new NollaPrng((uint)(worldSeed >> 1) + 12534);
        // Toxic sludge, blood, and soil for first
        for (int i = Materials.size() - 1; i >= 0; i--)
        {
            int rand = (int)(prng->Next() * (i + 1));
            std::swap(Materials[i], Materials[rand]);
        }
    }
};

static string _PickForSeed(uint worldSeed)
{
    NollaPrng *prng = new NollaPrng(worldSeed * 0.17127000 + 1323.59030000);
    // Preheat random!
    for (int i = 0; i < 5; i++)
    {
        prng->Next();
    }

    MaterialPicker *lc = new MaterialPicker(prng, worldSeed);
    string slc = "lc:" + accumulate(
                             std::next(lc->Materials.begin()),
                             lc->Materials.end() - 1,
                             lc->Materials[0],
                             [](string a, string b)
                             {
                                 return a + "," + b;
                             });
    MaterialPicker *ap = new MaterialPicker(prng, worldSeed);
    string sap = "ap:" + accumulate(
                             std::next(ap->Materials.begin()),
                             ap->Materials.end() - 1,
                             ap->Materials[0],
                             [](string a, string b)
                             {
                                 return a + "," + b;
                             });

    delete prng;
    delete lc;
    delete ap;

    return slc + ";" + sap;
}

void SetWorldSeed(uint worldseed)
{
    world_seed = worldseed;
}

void SetRandomSeed(double x, double y)
{
    uint a = world_seed ^ 0x93262e6f;
    uint b = a & 0xfff;
    uint c = (a >> 0xc) & 0xfff;

    double x_ = x + b;

    double y_ = y + c;

    double r = x_ * 134217727.0;
    uint64 e = SetRandomSeedHelper(r);

    uint64 _x = (*(uint64 *)&x_ & 0x7FFFFFFFFFFFFFFF);
    uint64 _y = (*(uint64 *)&y_ & 0x7FFFFFFFFFFFFFFF);
    if (102400.0 <= *((double *)&_y) || *((double *)&_x) <= 1.0)
    {
        r = y_ * 134217727.0;
    }
    else
    {
        double y__ = y_ * 3483.328;
        double t = e;
        y__ += t;
        y_ *= y__;
        r = y_;
    }

    uint64 f = SetRandomSeedHelper(r);

    uint g = SetRandomSeedHelper2(e, f, world_seed);
    double s = g;
    s /= 4294967295.0;
    s *= 2147483639.0;
    s += 1.0;

    if (2147483647.0 <= s)
    {
        s = s * 0.5;
    }
    random_seed = s;

    Random(0, 0);

    uint h = world_seed & 3;
    while (h)
    {
        Random(0, 0);
        h--;
    }
}

int Random(int a, int b)
{
    return (int)Random((double)a, (double)b + 1);
}

double ProceduralRandomf(double x, double y, double a, double b)
{
    SetRandomSeed(x, y);
    return Random(a, b);
}

int ProceduralRandomi(double x, double y, double a, double b)
{
    SetRandomSeed(x, y);
    return (int)Random(a, b);
}

string PickForSeed(uint seed)
{
    return _PickForSeed(seed);
}

#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(my_module)
{
    emscripten::function<int>("Random", &Random);
    emscripten::function("ProceduralRandomf", &ProceduralRandomf);
    emscripten::function("ProceduralRandomi", &ProceduralRandomi);
    emscripten::function("SetRandomSeed", &SetRandomSeed);
    emscripten::function("SetWorldSeed", &SetWorldSeed);
    emscripten::function<string>("PickForSeed", &PickForSeed);
}
