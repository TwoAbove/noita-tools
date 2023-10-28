#pragma once
// Thanks to kaliuresis!
// Check out his orb atlas repository: https://github.com/kaliuresis/noa
// #include <stdint.h>
#include <bit>
// #include <limits.h>
#include <iostream>
#include <cfenv>
#include <cmath>

#include "spells.h"

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

#define NOITA_SPELL_COUNT 413

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
        e &= 0x7FFFFFFFFFFFFFFF;
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
        uint e = SetRandomSeedHelper(r);

        uint64 _x = std::bit_cast<uint64_t>(x_) & 0x7fffffffffffffff;
        uint64 _y = std::bit_cast<uint64_t>(y_) & 0x7fffffffffffffff;
        if (102400.0 <= std::bit_cast<double>(_y) || std::bit_cast<double>(_x) <= 1.0)
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

        uint f = SetRandomSeedHelper(r);

        uint g = SetRandomSeedHelper2((uint)e, (uint)f, ws);

        // Kaliuresis bithackery!!! Nobody knows how it works. Equivalent to the old FP64 code.
        constexpr uint diddle_table[17] = {0, 4, 6, 25, 12, 39, 52, 9, 21, 64, 78, 92, 104, 118, 18, 32, 44};
        constexpr uint magic_number = 252645135; // magic number is 1/(1-2*actual ratio)
        uint t = g;
        t = g + (g < 2147483648) + (g == 0);
        t -= g / magic_number;
        t += (g % magic_number < diddle_table[g / magic_number]) && (g < 0xc3c3c3c3 + 4 || g >= 0xc3c3c3c3 + 62);
        t = (t + (g > 0x80000000)) >> 1;
        t = (int)t + (g == 0xffffffff);
        Seed = t;

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

void SetWorldSeed(uint worldseed)
{
    world_seed = worldseed;
}
uint GetWorldSeed()
{
    return world_seed;
}

// This looks like beta distribution?
float GetDistribution(float mean, int sharpness, float baseline)
{
    const float pi = 3.1415f;
    const float mean_offset = 0.5f - mean;
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
            float v11 = sin((mean_offset + r1) * pi);
            float v12 = pow(v11, sharpness);
            if (v12 > r2)
            {
                return r1;
            }
        }
        ++i;
    } while (i < 100);
    return g_rng.Next();
}

int RandomDistribution(int min, int max, int mean, int sharpness)
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

float RandomDistributionf(float min, float max, float mean, int sharpness)
{
    if (sharpness == 0.0)
    {
        float r = g_rng.Next();
        return (r * (max - min)) + min;
    }
    float adjMean = (mean - min) / (max - min);
    return min + (max - min) * GetDistribution(adjMean, sharpness, 0.005f); // Baseline is always this
}

bool unlockedSpells[NOITA_SPELL_COUNT] = {};

void SetUnlockedSpells(int i, int val)
{
    unlockedSpells[i] = !!val;
}

Spell GetRandomAction(float x, float y, int level, int offset = 0)
{
    NollaPrng *prng = new NollaPrng(0);
    prng->SetRandomSeed(world_seed + (uint)offset, x, y);
    double sum = 0;
    // all_spells length is NOITA_SPELL_COUNT
    for (int i = 0; i < NOITA_SPELL_COUNT; i++)
    {
        if (!unlockedSpells[i])
        {
            continue;
        }
        sum += all_spells[i].spawn_probabilities[level];
    }

    double multiplyer = prng->Next();
    double accumulated = sum * multiplyer;

    for (int i = 0; i < NOITA_SPELL_COUNT; i++)
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

    // all_spells length is NOITA_SPELL_COUNT
    for (int i = 0; i < NOITA_SPELL_COUNT; i++)
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

    for (int i = 0; i < NOITA_SPELL_COUNT; i++)
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
    int rand = prng->Next() * NOITA_SPELL_COUNT;
    Spell spell;
    for (int j = 0; j < NOITA_SPELL_COUNT; j++)
    {
        spell = all_spells[(j + rand) % NOITA_SPELL_COUNT];
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
