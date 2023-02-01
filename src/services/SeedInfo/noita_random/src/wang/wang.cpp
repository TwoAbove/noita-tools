#include <array>
#include <queue>
#include <stack>
#include <memory>
#include <vector>
#include <map>

#include "../noita_random.cpp"
#include "stb_hbwang.h"
#include "coalmine_hax.cpp"
#include "jps.hh"
#include <emscripten/val.h>

#include "pix.cpp"
#include "search.cpp"

// TODO: Look into optimizing with <https://github.com/google/highway>

const bool DEBUG = false;

NollaPrng GetRNG(int width)
{
   NollaPrng rng = NollaPrng();
   rng.SetRandomFromWorldSeed(world_seed);
   rng.Next();

   int iters = width + world_seed + 11 * (width / -11) - 12 * (world_seed / 12);

   if (iters > 0)
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

// This needs to be sorted for binary search
const array<unsigned long, 9> blockedColors = {
    0x00ac6e,
    0x70d79e,
    0x70d79f,
    0x70d7a1,
    0x7868ff,
    0xc35700,
    0xff0080,
    0xff00ff,
    0xff0aff};

template <class C, typename T>
bool contains(C &&c, T e) { return binary_search(begin(c), end(c), e); };

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

void rgbaToRgb(unsigned char *src, unsigned char *dest, uint w, uint h)
{
   unsigned long j = 0;
   unsigned long src_size = w * h;
   for (unsigned long i = 0; i < src_size; i++)
   {
      dest[j++] = src[i * 4];
      dest[j++] = src[i * 4 + 1];
      dest[j++] = src[i * 4 + 2];
   }
}

void rgbToRgba(unsigned char *src, unsigned char *dest, uint w, uint h)
{
   unsigned long j = 0;
   unsigned long src_size = w * h;
   for (unsigned long i = 0; i < src_size; i++)
   {
      dest[j++] = src[i * 3];
      dest[j++] = src[i * 3 + 1];
      dest[j++] = src[i * 3 + 2];
      dest[j++] = 255;
   }
}

enum mapToUse
{
   out,
   path
};

class MapGen
{
public:
   unsigned char *out_map;
   unsigned char *path_map;
   uint width;
   uint height;
   bool isCoalMine;
   bool shouldBlockOutRooms;
   unsigned int *randomMaterials;
   int worldX;
   int worldY;

   mapToUse usemap = out;

   std::unordered_map<unsigned long, shared_ptr<Node>> nodeList;
   unsigned long endNode;

   MapGen(
       unsigned char *_map,
       uint _width,
       uint _height,
       bool _isCoalMine,
       bool _shouldBlockOutRooms,
       unsigned int *_randomMaterials,
       int _worldX,
       int _worldY)
   {
      width = _width;
      height = _height;

      out_map = _map;
      path_map = (unsigned char *)malloc(3 * width * height);
      memcpy(path_map, out_map, 3 * width * height);

      isCoalMine = _isCoalMine;
      shouldBlockOutRooms = _shouldBlockOutRooms;
      randomMaterials = _randomMaterials;

      worldX = _worldX;
      worldY = _worldY;
   }

   ~MapGen()
   {
      free(path_map);
   }

   unsigned char *GetMap()
   {
      if (DEBUG)
      {
         return out_map;
      }
      switch (usemap)
      {
      case out:
         return out_map;
         break;
      case path:
         return path_map;
         break;

      default:
         return out_map;
         break;
      }
   }

   bool hasPath()
   {
      usemap = path;
      if (isCoalMine)
      {
         doCoalMineHax();
      }

      if (shouldBlockOutRooms)
      {
         blockOutRooms(COLOR_WHITE);
      }

      return isValid();
   }

   void finalize()
   {
      usemap = out;
      // Generated, now to fix up the map
      bool mainPath = isMainPath();
      if (!isCoalMine && mainPath)
      {
         fillMainPath();
      }
      if (shouldBlockOutRooms)
      {
         blockOutRooms(COLOR_BLACK);
      }
      if (isCoalMine)
      {
         undoCoalMineHax();
      }
      ClearPath();
      fillC0ffee();
      fillRandomMaterials();
   }

   void undoCoalMineHax()
   {
      unsigned char *map = GetMap();
      for (int y = 0; y < height; y++)
      {
         for (int x = 0; x < width; x++)
         {
            long overlayPos = getPos(256, 3, x, y);
            long i = getPos(width, 3, x, y);
            long pix = createRGB(coalmine_overlay[overlayPos], coalmine_overlay[overlayPos + 1], coalmine_overlay[overlayPos + 2]);
            if (pix == 0x4000)
            {
               // pudy248 note: is not actually air, this is the main rock portion of the overlay
               map[i] = 0x00;
               map[i + 1] = 0x00;
               map[i + 2] = 0x00;
            }
            if (pix == 0x0040)
            { // blue. Looks like air?
               map[i] = 0x00;
               map[i + 1] = 0x00;
               map[i + 2] = 0x00;
            }
            if (pix == 0xFEFEFE)
            { // white. Stairs. rock_static_intro
               // In the debug it's not shown, but used in path finding.
               map[i] = 0x00;
               map[i + 1] = 0x00;
               map[i + 2] = 0x00;
            }
         }
      }
   }

   void doCoalMineHax()
   {
      unsigned char *map = GetMap();
      for (int y = 0; y < height; y++)
      {
         for (int x = 0; x < width; x++)
         {
            long overlayPos = getPos(256, 3, x, y);
            long i = getPos(width, 3, x, y);
            long pix = createRGB(coalmine_overlay[overlayPos], coalmine_overlay[overlayPos + 1], coalmine_overlay[overlayPos + 2]);
            if (pix == 0x4000)
            {
               // pudy248 note: is not actually air, this is the main rock portion of the overlay
               map[i] = 0xFF;
               map[i + 1] = 0xFF;
               map[i + 2] = 0xFF;
            }
            if (pix == 0x0040)
            { // blue. Looks like air?
               map[i] = 0x00;
               map[i + 1] = 0x00;
               map[i + 2] = 0x00;
            }
            if (pix == 0xFEFEFE)
            { // white. Stairs. rock_static_intro
               // In the debug it's not shown, but used in path finding.
               map[i] = 0x0a;
               map[i + 1] = 0x33;
               map[i + 2] = 0x44;
            }
         }
      }
   }

   void ClearPath()
   {
      unsigned char *map = GetMap();
      int i = 0;
      shared_ptr<Node> n = nodeList[endNode];
      do
      {
         long c = getPixelColor(map, width, n->x, n->y);
         if (c == COLOR_COFFEE)
         {
            floodFill(map, width, height, n->x, n->y, COLOR_COFFEE, COLOR_BLACK);
         }
         n = nodeList[n->parentPos];
      } while (nodeList.contains(n->parentPos) && n->parentPos != (unsigned long)-1);
   }

   bool HasPathToBottom(
       uint path_start_x,
       bool fixed_x)
   {
      unsigned char *map = GetMap();
      Search s = Search(map, width, height, 0, height - 1);

      auto prepFound = [&]()
      {
         auto _n = s.pq.top();
         endNode = s.pos(_n->x, _n->y);
         nodeList = s.nodeList;
      };

      if (fixed_x)
      {
         bool hasPath = s.findPath(path_start_x, 0);
         if (hasPath)
         {
            prepFound();
            return true;
         }
         return false;
      }

      int x = path_start_x;

      while (x < width)
      {
         long c = getPixelColor(map, width, x, 0);
         if (c != COLOR_BLACK && c != COLOR_COFFEE)
         {
            x++;
            continue;
         }

         if (c == COLOR_COFFEE)
         {
            floodFill(map, width, height, x, 0, COLOR_COFFEE, COLOR_BLACK);
            continue;
         }

         bool hasPath = s.findPath(x, 0);
         if (hasPath)
         {
            prepFound();
            return true;
         }
         x++;
      }
      return false;
   }

   bool isMainPath()
   {
      int fill_x_from = (BIOME_PATH_FIND_WORLD_POS_MIN_X - (worldX - WORLD_OFFSET_X) * 512.0) / 10;
      int fill_x_to = fill_x_from + (BIOME_PATH_FIND_WORLD_POS_MAX_X - BIOME_PATH_FIND_WORLD_POS_MIN_X) / 10;
      return fill_x_to > 0 && fill_x_from > 0 && width > fill_x_from && fill_x_to < width + fill_x_from;
   }

   int fillMainPath()
   {
      unsigned char *map = GetMap();
      int fill_x_from = (BIOME_PATH_FIND_WORLD_POS_MIN_X - (worldX - WORLD_OFFSET_X) * 512.0) / 10;
      int fill_x_to = fill_x_from + (BIOME_PATH_FIND_WORLD_POS_MAX_X - BIOME_PATH_FIND_WORLD_POS_MIN_X) / 10;
      fill(map, width, fill_x_from, fill_x_to, 0, 6, COLOR_BLACK);
      return fill_x_from;
   }

   void clearStartingArea()
   {
      unsigned char *map = GetMap();
      uint x = 0;

      for (uint x = 0; x < width; x++)
      {
         long c = getPixelColor(map, width, x, 0);
         if (c == COLOR_COFFEE)
         {
            floodFill(map, width, height, x, 0, COLOR_COFFEE, COLOR_BLACK);
         }
      }
   }

   bool isValid()
   {
      uint path_start_x = 0;
      bool mainPath = isMainPath();
      if (isCoalMine)
      {
         path_start_x = 0x8e;
      }
      else if (mainPath)
      {
         path_start_x = fillMainPath();
      }

      bool hasPath = HasPathToBottom(path_start_x, mainPath);

      return hasPath;
   }

   void blockOutRooms(unsigned long targetColor)
   {
      unsigned char *map = GetMap();
      unsigned long posMax = width * height;

      for (unsigned long pos = 0; pos < posMax; pos++)
      {
         long color = getPixelColor(map, pos * 3);
         // ~70% of pixels are black or white, so skip them
         if (color == COLOR_BLACK)
         {
            continue;
         }
         if (color == COLOR_WHITE)
         {
            continue;
         }
         if (!binary_search(blockedColors.begin(), blockedColors.end(), color))
         {
            continue;
         }
         int x = pos % width;
         int y = pos / width;

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
         fill(map, width, startX, endX, startY, endY, targetColor);
      }
   }

   void fillC0ffee()
   {
      unsigned char *map = GetMap();
      NollaPrng rng = NollaPrng(0);
      rng.SetRandomFromWorldSeed(world_seed);
      rng.Next();

      unsigned long posMax = width * height;

      for (unsigned long pos = 0; pos < posMax; pos++)
      {
         long c = getPixelColor(map, pos * 3);
         if (c != COLOR_COFFEE)
         {
            continue;
         }

         long to = COLOR_BLACK;
         if (0.5f > (float)rng.Next()) // BIOME_RANDOM_BLOCK_CHANCE
         {
            to = COLOR_WHITE;
         }

         int x = pos % width;
         int y = pos / width;
         floodFill(map, width, height, x, y, COLOR_COFFEE, to);
      }
   }

   void fillRandomMaterials()
   {
      unsigned char *map = GetMap();
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

      int j = 0;
      for (int i = 0; i < r.size(); i++)
      {
         ToFrom *rr = r.at(i).get();
         unsigned long posMax = width * height;
         for (unsigned long pos = 0; pos < posMax; pos++)
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
};

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
    bool shouldBlockOutRooms,
    unsigned int randomMaterials[], // Maybe it's worth to pass a struct from JS?
    int worldX,
    int worldY)
{
   stbhw_tileset *ts;
   if (ts_map.contains(color))
   {
      ts = ts_map[color];
   }
   else
   {
      auto _ts = new stbhw_tileset();
      unsigned char *rgb_tiles_data = (unsigned char *)malloc(3 * tiles_w * tiles_h);
      rgbaToRgb(rgba_tiles_data, rgb_tiles_data, tiles_w, tiles_h);
      int success = stbhw_build_tileset_from_image(_ts, rgb_tiles_data, tiles_w * 3, tiles_w, tiles_h);
      if (!success)
      {
         printf("stbhw_build_tileset_from_image error: %s\n", stbhw_get_last_error());
         return;
      }
      free(rgb_tiles_data);
      ts_map[color] = _ts;
      ts = _ts;
   }

   NollaPrng rng = GetRNG(map_w);

   int tries = 0;
   long mod_malloc_amount = 3 * map_w * (map_h + 4);
   unsigned char *res = (unsigned char *)malloc(mod_malloc_amount);
   long malloc_amount = 3 * map_w * map_h;

   unsigned char *rgb_result = (unsigned char *)malloc(malloc_amount);

   bool hasPath = false;
   do
   {
      if (tries >= 100)
      {
         break;
      }

      NollaPrng rng2 = NollaPrng(rng.NextU());

      int success = stbhw_generate_image(ts, NULL, res, map_w * 3, map_w, map_h + 4, [&rng2]()
                                         { return rng2.NextU(); });
      if (!success)
      {
         printf("stbhw_generate_image error: %s\n", stbhw_get_last_error());
         return;
      }

      for (int i = 4 * 3 * map_w, j = 0; i < mod_malloc_amount; i++, j++)
      {
         rgb_result[j] = res[i];
      }

      MapGen mg = MapGen(rgb_result, map_w, map_h, isCoalMine, shouldBlockOutRooms, randomMaterials, worldX, worldY);

      hasPath = mg.hasPath();
      if (hasPath)
      {
         mg.finalize();
      }

      tries++;
      // } while (tries <= 0);
   } while (hasPath == false);

   // Cleanup
   free(res);
   rgbToRgba(rgb_result, rgba_result, map_w, map_h);
   free(rgb_result);
}

// map and result are allocated and freed in js.
// Only used in coalmines?
STBHW_EXTERN void generate_path_map(
    unsigned char map[],
    uint map_w,
    uint map_h,
    unsigned char result[],
    int worldX,
    int worldY)
{
   long malloc_amount = 3 * map_w * map_h;
   memcpy(result, map, malloc_amount);
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
