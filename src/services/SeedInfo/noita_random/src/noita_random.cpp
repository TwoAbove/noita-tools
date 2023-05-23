#pragma once
// Thanks to kaliuresis!
// Check out his orb atlas repository: https://github.com/kaliuresis/noa
// #include <stdint.h>
#include <algorithm>
#include <math.h>
#include <vector>
// #include <limits.h>
#include <iostream>
#include <iterator>
#include <cfenv>
#include <cmath>

#include "spells.cpp"

typedef int64_t __int64;
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

using namespace std;

float RoundHalfOfEven(float x)
{
    std::fesetround(FE_TONEAREST);
    return std::nearbyint(x);
}

uint64 SetRandomSeedHelper(double r)
{
    uint64 e = *(uint64 *)&r;
    if (((e >> 0x20 & 0x7fffffff) < 0x7ff00000) && (-9.223372036854776e+18 <= r) && (r < 9.223372036854776e+18))
    {
        // should be same as e &= ~(1<<63); which should also just clears the sign bit,
        // or maybe it does nothing,
        // but want to keep it as close to the assembly as possible for now
        e <<= 1;
        e >>= 1;
        double s = *(double *)&e;
        uint64 i = 0;
        if (s != 0.0)
        {
            uint64 f = (((uint64)e) & 0xfffffffffffff) | 0x0010000000000000;
            uint64 g = 0x433 - ((uint64)e >> 0x34);
            uint64 h = f >> g;

            int j = -(uint)(0x433 < ((e >> 0x20) & 0xffffffff) >> 0x14);
            i = (uint64)j << 0x20 | j;
            i = ~i & h | f << (((uint64)s >> 0x34) - 0x433) & i;
            i = ~-(uint64)(r == s) & -i | i & -(uint64)(r == s);
            // error handling, whatever
            // f = f ^
            // if((int) g > 0 && f )
        }
        return i & 0xffffffff;
    }

    // error!
    uint64 error_ret_val = 0x8000000000000000;
    return *(double *)&error_ret_val;
}

uint SetRandomSeedHelper2(const uint a, const uint b, const uint ws)
{
    uint uVar1;
    uint uVar2;
    uint uVar3;

    uVar2 = (a - b) - ws ^ ws >> 0xd;
    uVar1 = (b - uVar2) - ws ^ uVar2 << 8;
    uVar3 = (ws - uVar2) - uVar1 ^ uVar1 >> 0xd;
    uVar2 = (uVar2 - uVar1) - uVar3 ^ uVar3 >> 0xc;
    uVar1 = (uVar1 - uVar2) - uVar3 ^ uVar2 << 0x10;
    uVar3 = (uVar3 - uVar2) - uVar1 ^ uVar1 >> 5;
    uVar2 = (uVar2 - uVar1) - uVar3 ^ uVar3 >> 3;
    uVar1 = (uVar1 - uVar2) - uVar3 ^ uVar2 << 10;
    return (uVar3 - uVar2) - uVar1 ^ uVar1 >> 0xf;
}

class NollaPrng
{
public:
    double Seed;

    NollaPrng(double seed)
    {
        Seed = seed;
        Next();
    }

    uint H2(unsigned int a, unsigned int b, unsigned int ws)
    {
        unsigned int v3;
        unsigned int v4;
        unsigned int v5;
        int v6;
        unsigned int v7;
        unsigned int v8;
        int v9;

        v3 = (ws >> 13) ^ (b - a - ws);
        v4 = (v3 << 8) ^ (a - v3 - ws);
        v5 = (v4 >> 13) ^ (ws - v3 - v4);
        v6 = (v5 >> 12) ^ (v3 - v4 - v5);
        v7 = (v6 << 16) ^ (v4 - v6 - v5);
        v8 = (v7 >> 5) ^ (v5 - v6 - v7);
        v9 = (v8 >> 3) ^ (v6 - v7 - v8);
        return (((v9 << 10) ^ (v7 - v9 - v8)) >> 15) ^ (v8 - v9 - ((v9 << 10) ^ (v7 - v9 - v8)));
    }

    void SetRandomFromWorldSeed(uint s)
    {
        Seed = s;
        if (2147483647.0 <= Seed)
        {
            Seed = s * 0.5;
        }
    }

    void SetRandomSeed(uint ws, double x, double y)
    {
        uint a = ws ^ 0x93262e6f;
        uint b = a & 0xfff;
        uint c = (a >> 0xc) & 0xfff;

        double x_ = x + b;

        double y_ = y + c;

        double r = x_ * 134217727.0;
        uint64 e = SetRandomSeedHelper(r);

        uint64 _x = (*(uint64 *)&x_ & 0x7fffffffffffffff);
        uint64 _y = (*(uint64 *)&y_ & 0x7fffffffffffffff);
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

        uint g = SetRandomSeedHelper2(e, f, ws);
        double s = g;
        s /= 4294967295.0;
        s *= 2147483639.0;
        s += 1.0;

        if (2147483647.0 <= s)
        {
            s = s * 0.5;
        }

        Seed = s;

        Next();

        uint h = ws & 3;
        while (h)
        {
            Next();
            h--;
        }
    }

    NollaPrng() = default;

    uint NextU()
    {
        Next();
        return Seed * 4.656612875e-10 * 2147483645.0;
    }

    double Next()
    {
        int v4 = 0x41a7 * (int)Seed - 0x7FFFFFFF * ((int)Seed / 0x1f31d);
        if (v4 <= 0)
        {
            v4 += 0x7fffffff;
        }
        Seed = (double)v4;
        return Seed / 0x7fffffff;
    }

    int Random(int a, int b)
    {
        return a + (int)((double)(b + 1 - a) * Next());
    }
};

NollaPrng g_rng = NollaPrng(0);

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

static string PickForSeed()
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

void SetWorldSeed(uint worldseed)
{
    world_seed = worldseed;
}

// This looks like beta distribution?
float GetDistribution(float mean, float sharpness, float baseline)
{
    int i = 0;
    do
    {
        float r1 = g_rng.Next();
        float r2 = g_rng.Next();
        float div = fabs(r1 - mean);
        if (r2 < ((1.0 - div) * baseline))
        {
            return r1;
        }
        if (div < 0.5)
        {
            // double v11 = sin(((0.5f - mean) + r1) * M_PI);
            float v11 = sin(((0.5f - mean) + r1) * 3.1415f);
            float v12 = pow(v11, sharpness);
            if (v12 > r2)
            {
                return r1;
            }
        }
        i++;
    } while (i < 100);
    return g_rng.Next();
}

int RandomDistribution(int min, int max, int mean, float sharpness)
{
    if (sharpness == 0)
    {
        return g_rng.Random(min, max);
    }

    float adjMean = (float)(mean - min) / (float)(max - min);
    float v7 = GetDistribution(adjMean, sharpness, 0.005f); // Baseline is always this
    int d = (int)round((float)(max - min) * v7);
    return min + d;
}

float RandomDistributionf(float min, float max, float mean, float sharpness)
{
    if (sharpness == 0.0)
    {
        float r = g_rng.Next();
        return (r * (max - min)) + min;
    }
    float adjMean = (mean - min) / (max - min);
    return min + (max - min) * GetDistribution(adjMean, sharpness, 0.005f); // Baseline is always this
}

bool unlockedSpells[398] = {};

void SetUnlockedSpells(int i, int val)
{
    unlockedSpells[i] = !!val;
}

Spell GetRandomAction(float x, float y, int level, int offset = 0)
{
    NollaPrng *prng = new NollaPrng(0);
    prng->SetRandomSeed(world_seed + (uint)offset, x, y);
    double sum = 0;
    // all_spells length is 398
    for (int i = 0; i < 398; i++)
    {
        if (!unlockedSpells[i])
        {
            continue;
        }
        sum += all_spells[i].spawn_probabilities[level];
    }

    double multiplyer = prng->Next();
    double accumulated = sum * multiplyer;

    for (int i = 0; i < 398; i++)
    {
        if (!unlockedSpells[i])
        {
            continue;
        }
        Spell spell = all_spells[i];
        double probability = spell.spawn_probabilities[level];
        if (probability == 0.0)
        {
            continue;
        }
        if (probability >= accumulated)
        {
            delete prng;
            return spell;
        }
        accumulated -= probability;
    }

    return all_spells[0]; // Fallback just in case. Should be mathematically impossible
}

Spell GetRandomActionWithType(float x, float y, int level, int type, int offset = 0)
{
    NollaPrng *prng = new NollaPrng(0);
    prng->SetRandomSeed(world_seed + offset, x, y);
    double sum = 0;

    // all_spells length is 398
    for (int i = 0; i < 398; i++)
    {
        if (!unlockedSpells[i])
        {
            continue;
        }
        if (all_spells[i].type == type)
        {
            sum += all_spells[i].spawn_probabilities[level];
        }
    }

    double multiplyer = prng->Next();
    double accumulated = sum * multiplyer;

    for (int i = 0; i < 398; i++)
    {
        if (!unlockedSpells[i])
        {
            continue;
        }
        Spell spell = all_spells[i];
        if (all_spells[i].type != type)
        {
            continue;
        }
        double probability = spell.spawn_probabilities[level];
        if (probability > 0.0 && probability >= accumulated)
        {
            delete prng;
            return spell;
        }
        accumulated -= probability;
    }
    int rand = prng->Next() * 398;
    Spell spell;
    for (int j = 0; j < 398; j++)
    {
        spell = all_spells[(j + rand) % 398];
        if (spell.type == type && spell.spawn_probabilities[level] > 0.0)
        {
            if (!unlockedSpells[j])
            {
                continue;
            }
            delete prng;
            return spell;
        }
        j++;
    }

    delete prng;
    return spell;
}
