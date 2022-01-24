#include "noita_random.cpp"

int main()
{
  // SetWorldSeed(660419835);
  // {
  //   Spell s = GetRandomAction(-331., 1395., 0, 0);
  //   printf("%20s\t%s\n", s.id.c_str(), "LASER_LUMINOUS_DRILL");
  // }
  // {
  //   Spell s = GetRandomAction(-331., 1365., 0, 0);
  //   printf("%20s\t%s\n", s.id.c_str(), "TORCH");
  // }
  // {
  //   Spell s = GetRandomAction(-304.6, 1395., 0, 0);
  //   printf("%20s\t%s\n", s.id.c_str(), "CHAINSAW");
  // }
  // {
  //   Spell s = GetRandomAction(-304.6, 1365., 0, 0);
  //   printf("%20s\t%s\n", s.id.c_str(), "LIGHT");
  // }
  // {
  //   Spell s = GetRandomAction(-278.2, 1395., 0, 0);
  //   printf("%20s\t%s\n", s.id.c_str(), "SWAPPER_PROJECTILE");
  // }
  // {
  //   Spell s = GetRandomAction(-278.2, 1365., 0, 0);
  //   printf("%20s\t%s\n", s.id.c_str(), "CHAINSAW");
  // }
  // {
  //   Spell s = GetRandomAction(-251.8, 1395., 0, 0);
  //   printf("%20s\t%s\n", s.id.c_str(), "CHAIN_BOLT");
  // }
  // {
  //   Spell s = GetRandomAction(-251.8, 1365., 0, 0);
  //   printf("%20s\t%s\n", s.id.c_str(), "TELEPORT_CAST");
  // }
  // {
  //   Spell s = GetRandomAction(-225.4, 1395., 0, 0);
  //   printf("%20s\t%s\n", s.id.c_str(), "BLACK_HOLE");
  // }
  // {
  //   Spell s = GetRandomAction(-225.4, 1365., 0, 0);
  //   printf("%20s\t%s\n", s.id.c_str(), "SPITTER");
  // }

  // SetWorldSeed(153761947);
  // SetRandomSeed(12.3, 123);
  // printf("%i\n", RandomDistribution(1, 100, 30)); // 16
  // SetRandomSeed(12.3, 123);

  // double d = RandomDistributionf(0.5, 25.5, 12.2); // 4.1980390548706
  // cout.precision(17);
  // cout << fixed << d << endl;
  // SetWorldSeed(475763681);
  // SetRandomSeed(12.3, 123);
  // int count = 100;
  // for (int i = 1; i <= count; i++)
  // {
  //   int r = Random(0, 100);
  //   cout << r << endl;
  // }

  double ans[] = {
      1.0664682388306,
      1.2400616407394,
      1.114196062088,
      1.5478837490082,
      1.3552150726318,
      1.0862169265747,
      1.079749584198,
      1.2963439226151,
      1.2796461582184,
      1.006581902504,
      2,
      1,
      1,
      1,
      1,
      2,
      1,
      1,
      1,
      1};

  SetWorldSeed(153761947);
  SetRandomSeed(123, 321);
  double avg = 0;
  for (int i = 0; i < 10; i++)
  {
    double res = RandomDistributionf(1, 3, 1, 3);
    int diff = (int)(ans[i] - res);
    // avg += res;
    cout << ans[i] << " " << diff << " " << res << endl;
  }
  avg = 0;
  for (int i = 10; i < 20; i++)
  {
    int res = RandomDistribution(1, 3, 1, 3);
    int diff = (int)(ans[i] - res);
    // avg += res;
    cout << ans[i] << " " << diff << " " << res << endl;
  }

  // cout << endl << avg / 10000. << endl;

  // double avg2 = 0;
  // for (int i = 0; i < 10000; i++) {
  //   double res = Randomf();
  //   avg2 += res;
  //   // cout << res << endl;
  // }

  // cout << endl << avg2 / 10000. << endl;

  return 0;
};
