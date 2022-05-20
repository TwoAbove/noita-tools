#include "noita_random.cpp"

int locked[] = {
    18,
    90,
    141,
    171,
    255,
    327,
    328,
    329,
    330,
    331,
    332,
    333,
    334,
    335,
    336,
    337,
    338,
    339,
    347,
    348,
    349,
    350,
    351,
    352,
    354,
    361,
    374,
    378,
    379,
    380,
    381,
    382,
    383,
    384,
    385,
    386,
    387,
    388,
    389,
    390,
    391,
    392,
};

int main()
{
  for (int i = 0; i < 393; i++)
  {
    SetUnlockedSpells(i, 1);
  }
  for (int i = 0; i < 42; i++)
  {
    SetUnlockedSpells(locked[i], 0);
  }
  // SetWorldSeed(1482679641);
  SetWorldSeed(1871377166);
  SetRandomSeed(1, 1);

  for (int i = 0; i < 1000; i++){
    cout << Random((int)3.4272000000000005, (int)6.720000000000001) <<endl;
  }

  // cout.precision(18);

  // cout << RandomDistribution(2, 7, 4, 4) << endl; // -- 3
  // cout << RandomDistribution(2, 7, 4, 4) << endl; // -- 3
  // cout << RandomDistribution(2, 7, 4, 4) << endl; // -- 4
  // cout << endl;
  // cout << RandomDistributionf(0.8, 1.2, 1, 6) << endl; // 0.98004007339478
  // cout << 0.98004007339478 << endl;
  // cout << endl;
  // cout << RandomDistributionf(0.8, 1.2, 1, 6) << endl; // 1.032301068306
  // cout << 1.032301068306 << endl;
  // cout << endl;
  // cout << RandomDistributionf(0.8, 1.2, 1, 6) << endl; // 0.91669422388077
  // cout << 0.91669422388077 << endl;
  // cout << endl;
  // cout << 2 << endl;
  // cout << Random(1, 3) << endl; // 2
  // cout << endl;
  // cout << 0 << endl;
  // cout << Random(0, 1) << endl; // 0
  // cout << endl;
  // cout << 44 << endl;
  // cout << Random(0, 100) << endl; // 44
  // cout << endl;
  // cout << 0.13491553068161 << endl;
  // cout << Randomf() << endl; // 0.13491553068161

  // for (int i = 0; i < 10000; i++) {
  //   Randomf();
  // }
  // cout << endl;
  // cout << 0.27106264233589 << endl;
  // cout << Randomf() << endl; // 0.27106264233589

  // cout << endl;

  // cout << GetRandomActionWithType(0, 0, 4, 0).id << endl; // CHAIN_BOLT
  // cout << GetRandomActionWithType(1, 1, 4, 0).id << endl; // TENTACLE_PORTAL
  // cout << GetRandomActionWithType(2, 2, 4, 0).id << endl; // BOMB
  // cout << GetRandomActionWithType(3, 3, 4, 0).id << endl; // CHAIN_BOLT
  // cout << endl;

  // cout << GetRandomActionWithType(0, 0, 4, 1).id << endl; // POLYMORPH_FIELD
  // cout << GetRandomActionWithType(1, 1, 4, 1).id << endl; // FRIEND_FLY
  // cout << GetRandomActionWithType(2, 2, 4, 1).id << endl; // BOMB_DETONATOR
  // cout << GetRandomActionWithType(3, 3, 4, 1).id << endl; // POLYMORPH_FIELD
  // cout << endl;

  // cout << GetRandomActionWithType(0, 0, 4, 2).id << endl; // FREEZE
  // cout << GetRandomActionWithType(1, 1, 4, 2).id << endl; // QUANTUM_SPLIT
  // cout << GetRandomActionWithType(2, 2, 4, 2).id << endl; // SPREAD_REDUCE
  // cout << GetRandomActionWithType(3, 3, 4, 2).id << endl; // HITFX_BURNING_CRITICAL_HIT
  // cout << endl;

  // cout << GetRandomAction(0, 0, 4, 3).id << endl; // SCATTER_4
  // cout << GetRandomAction(1, 1, 4, 3).id << endl; // BURST_2
  // cout << GetRandomAction(2, 2, 4, 3).id << endl; // BURST_2
  // cout << GetRandomAction(3, 3, 4, 3).id << endl; // SCATTER_4
  // cout << endl;

  return 0;
};
