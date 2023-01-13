#include <array>
#include <queue>
#include <stack>
#include <memory>
#include <vector>
#include <map>

#include "stb_hbwang.h"
#include "coalmine_hax.cpp"
#include "jps.hh"
#include <emscripten/val.h>

const unsigned long COLOR_PURPLE = 0x7f007f;
const unsigned long COLOR_BLACK = 0x000000;
const unsigned long COLOR_WHITE = 0xffffff;
const unsigned long COLOR_YELLOW = 0xffff00;
const unsigned long COLOR_COFFEE = 0xc0ffee;
const unsigned long COLOR_01CFEE = 0x01cfee;

// TODO: Look into optimizing with <https://github.com/google/highway>

const bool DEBUG = false;

unsigned long createRGB(const unsigned char r, const unsigned char g, const unsigned char b)
{
   return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

unsigned long getPos(const uint w, unsigned char f, const uint x, const uint y)
{
   return w * y * f + f * x;
}

unsigned long getPixelColor(const unsigned char *map, unsigned long long pos)
{
   unsigned char r = map[pos];
   unsigned char g = map[pos + 1];
   unsigned char b = map[pos + 2];
   return createRGB(r, g, b);
}
unsigned long getPixelColor(const unsigned char *map, const uint w, const uint x, const uint y)
{
   unsigned long long pos = getPos(w, 3, x, y);
   return getPixelColor(map, pos);
}

void setPixelColor(unsigned char *map, unsigned long long pos, unsigned long color)
{
   unsigned char r = ((color >> 16) & 0xff);
   unsigned char g = ((color >> 8) & 0xff);
   unsigned char b = ((color)&0xff);
   map[pos] = r;
   map[pos + 1] = g;
   map[pos + 2] = b;
}
void setPixelColor(unsigned char *map, uint w, uint x, uint y, unsigned long color)
{
   unsigned long long pos = getPos(w, 3, x, y);
   setPixelColor(map, pos, color);
}

void fill(unsigned char *map,
          int w,
          int x1,
          int x2,
          int y1,
          int y2,
          long color)
{
   for (int x = x1; x <= x2; x++)
   {
      for (int y = y1; y <= y2; y++)
      {
         setPixelColor(map, w, x, y, color);
      }
   }
}

void floodFill(unsigned char *map,
               uint width,
               uint height,
               uint initialX,
               uint initialY,
               unsigned long fromColor,
               unsigned long toColor)
{
   stack<pair<uint, uint>> s;
   unsigned char *visited = (unsigned char *)calloc(width * height, 1);

   if (initialX < 0 || initialX >= width || initialY < 0 || initialY >= height)
   {
      return;
   }

   s.push(std::make_pair(initialX, initialY));
   visited[getPos(width, 1, initialX, initialY)] = true;

   int filled = 0;

   auto tryNext = [&map, &width, &height, &s, &visited, &fromColor, &toColor](uint nx, uint ny)
   {
      if (nx < 0 || nx >= width || ny < 0 || ny >= height)
      {
         return;
      }

      unsigned long long p = getPos(width, 1, nx, ny);
      if (visited[p] == true)
      {
         return;
      }

      unsigned long nc = getPixelColor(map, p * 3);
      if (nc != fromColor || nc == toColor)
      {
         return;
      }

      visited[p] = true;
      s.push(std::make_pair(nx, ny));
   };

   while (!s.empty())
   {
      auto pos = s.top();
      const int x = pos.first;
      const int y = pos.second;
      s.pop();

      setPixelColor(map, width, x, y, toColor);
      filled++;

      tryNext(x - 1, y);
      tryNext(x + 1, y);
      tryNext(x, y - 1);
      tryNext(x, y + 1);
   }
   free(visited);
}

void fillC0ffee(
    unsigned char *map,
    uint width,
    uint height)
{
   NollaPrng rng = NollaPrng(0);
   rng.SetRandomFromWorldSeed(world_seed);
   unsigned long long pos = 0;
   unsigned long long posMax = width * height;
   for (pos = 0; pos < posMax; pos++)
   {
      long c = getPixelColor(map, pos * 3);
      if (c != COLOR_COFFEE)
      {
         continue;
      }
      long to = COLOR_BLACK;
      double f = rng.Next();
      if (f < 0.5) // BIOME_RANDOM_BLOCK_CHANCE
      {
         to = COLOR_WHITE;
      }
      int x = pos % width;
      int y = pos / width;
      floodFill(map, width, height, x, y, COLOR_COFFEE, to);
   }
}

NollaPrng GetRNG(int map_w)
{
   NollaPrng rng = NollaPrng();
   rng.SetRandomFromWorldSeed(world_seed);
   rng.Next();
   int length = (int)((unsigned long long)((long long)map_w * -0x2e8ba2e9) >> 0x20);
   int iters = ((length >> 1) - (length >> 0x1f)) * 0xb + ((uint)world_seed / 0xc) * -0xc +
               world_seed + map_w;
   if (0 < iters)
   {
      do
      {
         rng.Next();
         iters -= 1;
      } while (iters != 0);
   }
   return rng;
}

class ToFrom
{
public:
   unsigned int from;
   vector<unsigned int> to;
   NollaPrng rng = NollaPrng(0);

   ToFrom(unsigned int _from,
          vector<unsigned int> _to, int width)
   {
      from = _from;
      to = _to;
      rng = GetRNG(width);
      rng.Next();
   }
   ~ToFrom()
   {
   }
};
void fillRandomMaterials(
    unsigned char *map,
    uint width,
    uint height,
    unsigned int *randomMaterials)
{
   int numberOfRandoms = randomMaterials[0];
   if (numberOfRandoms == 0)
   {
      return;
   }
   vector<shared_ptr<ToFrom>> r;
   r.reserve(32);
   int pos = 1;
   for (int i = 0; i < numberOfRandoms; i++)
   {
      unsigned int fromInt = randomMaterials[pos];
      int numOfToMaterials = randomMaterials[pos + 1];
      vector<unsigned int> toMaterials;
      int p = pos + 2;
      for (; p < pos + 2 + numOfToMaterials; p++)
      {
         toMaterials.push_back(randomMaterials[p]);
      }
      r.push_back(make_shared<ToFrom>(ToFrom(fromInt, toMaterials, width)));
      pos = p;
   }
   // NollaPrng rng = NollaPrng(0);
   // rng.SetRandomFromWorldSeed(world_seed);
   int j = 0;
   for (int i = 0; i < r.size(); i++)
   {
      ToFrom *rr = r.at(i).get();
      unsigned long long posMax = width * height;
      for (unsigned long long pos = 0; pos < posMax; pos++)
      {
         long c = getPixelColor(map, pos * 3);
         if (c != rr->from)
         {
            continue;
         }
         int rand = rr->rng.Random(0, rr->to.size() - 1);
         int x = pos % width;
         int y = pos / width;
         floodFill(map, width, height, x, y, rr->from, rr->to.at(rand));
         j++;
      }
   }
}

void doCoalMineHax(
    unsigned char *map,
    int width,
    int height)
{
   for (int i = 0; i < width * height * 3; i += 3)
   {
      long pix = createRGB(coalmine_overlay[i], coalmine_overlay[i + 1], coalmine_overlay[i + 2]);
      if (pix == 0x4000)
      { // green. Looks like air?
         map[i] = 0x00;
         map[i + 1] = 0x00;
         map[i + 2] = 0x00;
         // pudy248 note: is not actually air, this is the main rock portion of the overlay
         //  map[i] = 0xFF;
         //  map[i + 1] = 0xFF;
         //  map[i + 2] = 0xFF;
      }
      if (pix == 0x0040)
      { // blue. Looks like air?
         map[i] = 0x00;
         map[i + 1] = 0x00;
         map[i + 2] = 0x00;
      }
      if (pix == 0xFEFEFE)
      { // white. Stairs. rock_static_intro
         // But in the debug it's not shown?
         // map[i] = 0x0a;
         // map[i + 1] = 0x33;
         // map[i + 2] = 0x44;
         map[i] = 0x00;
         map[i + 1] = 0x00;
         map[i + 2] = 0x00;
         // map[i] = 0xFF;
         // map[i + 1] = 0xFF;
         // map[i + 2] = 0xFF;
      }
   }
}

const array<unsigned long, 7> blockedColors = {
    0x00ac6e,
    0x70d79e,
    0x70d7a1,
    0x7868ff,
    0xff0080,
    0xff00ff,
    0xff0aff};

template <class C, typename T>
bool contains(C &&c, T e) { return find(begin(c), end(c), e) != end(c); };

void blockOutRooms(
    unsigned char *map,
    int width,
    int height)
{
   for (int y = 0; y < height - 1; y++)
   {
      for (int x = 0; x < width; x++)
      {
         long color = getPixelColor(map, width, x, y);
         if (!contains(blockedColors, color))
         {
            continue;
         }
         int startX = x + 1;
         int endX = x + 1;
         int startY = y + 1;
         int endY = y + 1;
         bool foundEnd = false;
         while (!foundEnd && endX < width)
         {
            long c = getPixelColor(map, width, endX, startY);
            if (c == COLOR_BLACK)
            {
               endX += 1;
               continue;
            };
            endX -= 1;
            foundEnd = true;
         }
         if (endX >= width)
         {
            endX = width - 1;
         }
         foundEnd = false;
         while (!foundEnd && endY < height)
         {
            long c = getPixelColor(map, width, startX, endY);
            if (c == COLOR_BLACK)
            {
               endY += 1;
               continue;
            };
            endY -= 1;
            foundEnd = true;
         }
         if (endY >= height)
         {
            endY = height - 1;
         }
         fill(map, width, startX, endX, startY, endY, COLOR_WHITE);
      }
   }
}

int BIOME_PATH_FIND_WORLD_POS_MIN_X = 159;
int BIOME_PATH_FIND_WORLD_POS_MAX_X = 223;
int WORLD_OFFSET_Y = 14;
int WORLD_OFFSET_X = 35;

double GetBiomeOffsetX()
{
   NollaPrng rng = NollaPrng(world_seed);
   double someRand = rng.Next() * 9999.0 + 1.0;
   double someRand2 = rng.Next() * 200000.0 - 100000.0;
   double offset = rng.Next() * 200000.0 - 100000.0;
   return offset;
}

struct Node
{
   int x;
   int y;

   int targetX;
   int targetY;

   shared_ptr<Node> parent;
   shared_ptr<Node> getParent()
   {
      return parent;
   }

   Node(int _x, int _y)
   {
      x = _x;
      y = _y;
   }

   Node(int _x, int _y, int _targetX, int _targetY, shared_ptr<Node> _parent)
   {
      x = _x;
      y = _y;
      targetX = _targetX;
      targetY = _targetY;
      parent = _parent;
   }

   Node(int _x, int _y, int _targetX, int _targetY)
   {
      x = _x;
      y = _y;
      targetX = _targetX;
      targetY = _targetY;
   }

   bool operator<(const Node &b) const
   {
      const int h = Manhattan();
      const int hb = b.Manhattan();
      return h < hb;
   }

   int H() const
   {
      return ManhattanDown();
   }

   int Manhattan() const
   {
      const int dx = abs(x - targetX);
      const int dy = abs(y - targetY);
      return (dx + dy);
   }

   int ManhattanDown() const
   {
      const int dy = abs(y - targetY);
      return (dy);
   }
   int Chebyshev() const
   {
      const int dx = abs(x - targetX);
      const int dy = abs(y - targetY);
      return max(dx, dy);
   }
   int Euclidean() const
   {
      const int dx = abs(x - targetX);
      const int dy = abs(y - targetY);
      return (int)sqrt(dx * dx + dy * dy);
   }
};

struct NodeComparator
{
   bool operator()(const shared_ptr<Node> a, const shared_ptr<Node> b) const
   {
      return a->H() >= b->H();
   }
};

class Search
{
public:
   unsigned char *map;
   int width;
   int height;
   vector<vector<char>> visited;
   int targetX;
   int targetY;
   shared_ptr<Node> root;

   // struct CompareNode
   // {
   //    bool operator()(const Node *a, const Node *b)
   //    {

   //       // if (a->y == b->y) {
   //       //    return a->x < b->x;
   //       // }
   //       return Manhattan(a) < Manhattan(b);
   //       // return a->x - a->y <= b->x - b->y;
   //    }
   // };
   priority_queue<shared_ptr<Node>, vector<shared_ptr<Node>>, NodeComparator> pq;
   // priority_queue<Node *, vector<Node *>, CompareNode> pq;

   Search(unsigned char _map[], int _width, int _height, int _targetX, int _targetY)
   {
      map = _map;
      width = _width;
      height = _height;
      targetX = _targetX;
      targetY = _targetY;
      visited = vector<vector<char>>(height);
      for (int i = 0; i < height; i++)
      {
         visited[i] = vector<char>(width);
      }
   }

   bool findPath(int x, int y)
   {
      visited.at(y).at(x) = true;
      setPixelColor(map, width, x, y, COLOR_PURPLE);
      root = make_shared<Node>(Node(x, y, targetX, targetY));
      pq.push(root);
      while (!pq.empty())
      {
         shared_ptr<Node> n = pq.top();
         if (atTarget(n))
         {
            return true;
         }
         pq.pop();
         tryNext(n->x, n->y - 1, n);
         tryNext(n->x - 1, n->y, n);
         tryNext(n->x + 1, n->y, n);
         tryNext(n->x, n->y + 1, n);
      }
      return false;
   }

   // void tracePath()
   // {
   //    long c = COLOR_YELLOW;
   //    shared_ptr<Node> n = root;
   //    printf("1\n");
   //    int i = 0;
   //    while (n.get())
   //    {
   //       printf("[%i %i]\n", n->x, n->y);
   //       printf("a %i\n", i);
   //       setPixelColor(map, width, n->x, n->y, c -= 0xff);
   //       printf("b %i\n", i);
   //       n = n->getParent();
   //       printf("c %i\n", i);
   //       i++;
   //    }
   // }

private:
   void
   tryNext(int x, int y, shared_ptr<Node> n)
   {
      if (traversable(x, y) && !isVisited(x, y))
      {
         setPixelColor(map, width, x, y, COLOR_PURPLE);
         visited.at(y).at(x) = true;
         pq.push(make_shared<Node>(Node(x, y, targetX, targetY, n)));
      }
   }

   bool isVisited(int x, int y)
   {
      return visited.at(y).at(x);
   }

   bool traversable(int x, int y)
   {
      if (x >= 0 && y >= 0 && x < width && y < height)
      {
         long c = getPixelColor(map, width, x, y);

         return c == COLOR_BLACK;
      }
      return false;
   }

   bool atTarget(shared_ptr<Node> n)
   {
      return targetY == n->y;
   }
};

bool TryPath(
    unsigned char *map,
    uint width,
    uint height,
    uint path_start_x)
{
   Search s = Search(map, width, height, 0, height - 1);

   bool hasPath = s.findPath(path_start_x, 0);
   // if (DEBUG)
   // {
   //    s->tracePath();
   // }
   return hasPath;
}

bool HasPathToBottom(
    unsigned char *map,
    uint width,
    uint height,
    uint path_start_x,
    bool fixed_x)
{
   if (fixed_x)
   {
      return TryPath(map, width, height, path_start_x);
   }
   int x = path_start_x;

   while (x < width)
   {
      long c = getPixelColor(map, width, x, 0);
      if (c != COLOR_BLACK)
      {
         x++;
         continue;
      }

      bool hasPath = TryPath(map, width, height, x);
      if (hasPath)
      {
         return true;
      }
   }
   return false;
}

bool isMainPath(
    int width, int worldX)
{
   int fill_x_from = (BIOME_PATH_FIND_WORLD_POS_MIN_X - (worldX - WORLD_OFFSET_X) * 512.0) / 10;
   int fill_x_to = fill_x_from + (BIOME_PATH_FIND_WORLD_POS_MAX_X - BIOME_PATH_FIND_WORLD_POS_MIN_X) / 10;
   return fill_x_to > 0 && fill_x_from > 0 && width > fill_x_from && fill_x_to < width + fill_x_from;
}

int fillMainPath(
    unsigned char *map,
    int width,
    int worldX)
{
   int fill_x_from = (BIOME_PATH_FIND_WORLD_POS_MIN_X - (worldX - WORLD_OFFSET_X) * 512.0) / 10;
   int fill_x_to = fill_x_from + (BIOME_PATH_FIND_WORLD_POS_MAX_X - BIOME_PATH_FIND_WORLD_POS_MIN_X) / 10;
   fill(map, width, fill_x_from, fill_x_to, 0, 6, COLOR_BLACK);
   return fill_x_from;
}

bool isValid(
    unsigned char *map,
    uint width,
    uint height,
    int worldX,
    bool isCoalMine)
{
   uint path_start_x = 0;
   bool mainPath = isMainPath(width, worldX);
   if (mainPath)
   {
      if (isCoalMine)
      {
         path_start_x = 0x8e;
      }
      if (!isCoalMine)
      {
         path_start_x = fillMainPath(map, width, worldX);
      }
   }
   bool hasPath = HasPathToBottom(map, width, height, path_start_x, mainPath);

   return hasPath;
}

void rgbaToRgb(unsigned char src[], unsigned char dest[], uint w, uint h)
{
   long long j = 0;
   long long src_size = 4 * w * h;
   for (long long i = 0; i < src_size; i++)
   {
      if (i && (i + 1) % 4 == 0)
         continue;
      dest[j] = src[i];
      j++;
   }
}

void rgbToRgba(unsigned char *src, unsigned char *dest, uint w, uint h)
{
   long long j = 0;
   long long src_size = 3 * w * h;
   for (long long i = 0; i < src_size; i++)
   {
      dest[j] = src[i];
      j++;
      if (i && (i + 1) % 3 == 0)
      {
         dest[j] = dest[j-1] != 0 ? 255 : 254;
         j++;
      }
   }
}

std::map<unsigned long, stbhw_tileset *> ts_map = {};

// tiles_data and result are allocated and freed in js.
STBHW_EXTERN void generate_map(
    unsigned char rgba_tiles_data[],
    unsigned long color,
    uint tiles_w,
    uint tiles_h,
    unsigned char rgba_result[],
    uint map_w,
    uint map_h,
    bool isCoalMine,
    unsigned int randomMaterials[], // Maybe it's worth to pass a struct from JS?
    int worldX,
    int worldY)
{
   stbhw_tileset ts;
   if (ts_map.contains(color))
   {
      ts = *ts_map[color];
   }
   else
   {
      unsigned char *rgb_tiles_data = (unsigned char *)malloc(3 * tiles_w * tiles_h);
      rgbaToRgb(rgba_tiles_data, rgb_tiles_data, tiles_w, tiles_h);
      int success = stbhw_build_tileset_from_image(&ts, rgb_tiles_data, tiles_w * 3, tiles_w, tiles_h);
      if (!success)
      {
         printf("stbhw error: %s\n", stbhw_get_last_error());
         return;
      }
      free(rgb_tiles_data);
      ts_map[color] = &ts;
   }

   NollaPrng rng = GetRNG(map_w);
   NollaPrng rng2 = NollaPrng(0);

   int tries = 0;
   unsigned char *res = (unsigned char *)malloc(3 * map_w * (map_h + 4));
   long malloc_amount = 3 * map_w * map_h;
   unsigned char *map = (unsigned char *)malloc(malloc_amount);
   bool hasPath = false;

   unsigned char *rgb_result = (unsigned char *)malloc(malloc_amount);

   do
   {
      if (tries > 99)
      {
         break;
      }

      rng2.Seed = rng.Next() * 2147483645.0;
      rng2.Next();

      stbhw_generate_image(&ts, NULL, res, map_w * 3, map_w, map_h + 4, std::bind(&NollaPrng::NextU, &rng2));
      for (int i = 4 * 3 * map_w, j = 0; i < 3 * map_w * (map_h + 4); i++, j++)
      {
         rgb_result[j] = res[i];
      }
      fillC0ffee(rgb_result, map_w, map_h);
      if (isCoalMine)
      {
         doCoalMineHax(rgb_result, map_w, map_h);
      }
      // Do all the checks on a copy of the map
      for (int i = 0; i < malloc_amount; i++)
      {
         map[i] = rgb_result[i];
      }
      if (worldY < 20 && worldX > 32 && worldX < 39)
      {
         blockOutRooms(DEBUG ? rgb_result : map, map_w, map_h);
      }
      hasPath = isValid(DEBUG ? rgb_result : map, map_w, map_h, worldX, isCoalMine);
      fillRandomMaterials(rgb_result, map_w, map_h, randomMaterials);
      tries++;
   } while (hasPath == false);
   free(map);
   free(res);

   rgbToRgba(rgb_result, rgba_result, map_w, map_h);
   free(rgb_result);
}

// map and result are allocated and freed in js.
STBHW_EXTERN void generate_path_map(
    unsigned char map[],
    uint map_w,
    uint map_h,
    unsigned char result[],
    int worldX,
    int worldY)
{
   bool mainPath = isMainPath(map_w, worldX);
   long malloc_amount = 3 * map_w * map_h;
   for (int i = 0; i < malloc_amount; i++)
   {
      result[i] = map[i];
   }
   uint path_start_x = 0x8e;
   floodFill(result, map_w, map_h, path_start_x, 1, COLOR_BLACK, COLOR_PURPLE);
}

int GetWidthFromPix(int a, int b)
{
   return ((b * 512) / 10 - (a * 512) / 10);
}

int GetGlobalPos(int a, int b, int c)
{
   return ((b * 512) / 10 - (a * 512) / 10) * 10 + c;
}
