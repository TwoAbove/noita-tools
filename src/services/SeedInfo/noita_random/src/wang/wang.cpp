#include <array>
#include <queue>
#include <stack>
#include <memory>
#include <vector>
#include <map>
#include <string>
#include <functional>
#include <algorithm>

#include "../noita_random.cpp"
#include "stb_hbwang.h"
#include "coalmine_hax.cpp"
#include "jps.hh"
#include <emscripten/val.h>

#include "pix.cpp"
#include "search.cpp"
#include "png.cpp"
#include "MurmurHash3.cpp"

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
vector<unsigned long> blockedColors = vector<unsigned long>(
    {
        0x00ac6e, // load_pixel_scene4_alt
        0x70d79e, // load_gunpowderpool_01
        0x70d79f, //???
        0x70d7a1, // load_gunpowderpool_04
        0x7868ff, // load_gunpowderpool_02
        0xc35700, // load_oiltank
        0xff0080, // load_pixel_scene2
        0xff00ff, //???
        0xff0aff, // load_pixel_scene
    });

template <class C, typename T>
bool contains(C &&c, T e) { return binary_search(begin(c), end(c), e); };

const int BIOME_PATH_FIND_WORLD_POS_MIN_X = 159;
const int BIOME_PATH_FIND_WORLD_POS_MAX_X = 223;

const int WORLD_OFFSET_X = 35;
const int WORLD_OFFSET_Y = 14;

int GetWidthFromPix(const int a, const int b, const int offset)
{
   return (((b - offset) * 512) / 10 - ((a - offset) * 512) / 10);
}
int GetWidthFromPix(const int a, const int b)
{
   return GetWidthFromPix(a, b, 0);
}

std::vector<int> GetTilePos(const int gx, const int gy)
{
   int x = (int)floor(gx / 512.0) + WORLD_OFFSET_X;
   int y = (int)floor(gy / 512.0) + WORLD_OFFSET_Y;
   return {x, y};
}

std::vector<int> GetGlobalPos(const int x, const int y)
{
   int gx = 512 * (x - WORLD_OFFSET_X);
   int gy = 512 * (y - WORLD_OFFSET_Y);

   return {gx, gy};

   // int gx = ((512 * x) / 10 - (512 * WORLD_OFFSET_X) / 10) * 10 - 5;
   // int gy = ((512 * y) / 10 - (512 * WORLD_OFFSET_Y) / 10) * 10 - 13;

   // return {gx, gy};
}

// // Get the delta position from the global position
// std::vector<int> GetDeltaPos(const int x1, const int y1, const int x0, const int y0)
// {
//    int dx = ((int)((x1 * 512) / 10) * 10 - (int)((x0 * 512) / 10) * 10);
//    int dy = ((int)((y1 * 512) / 10) * 10 - (int)((y0 * 512) / 10) * 10);
//    return {dx, dy};
// }

double GetBiomeOffsetX()
{
   NollaPrng rng = NollaPrng(world_seed);
   double someRand = rng.Next() * 9999.0 + 1.0;
   double someRand2 = rng.Next() * 200000.0 - 100000.0;
   double offset = rng.Next() * 200000.0 - 100000.0;
   return offset;
}

void rgbaToRgb(const unsigned char *src, unsigned char *dest, uint w, uint h)
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

void rgbToRgba(const unsigned char *src, unsigned char *dest, uint w, uint h)
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

void whiteout(unsigned char *src, uint w, uint h)
{
   unsigned long src_size = w * h;
   for (unsigned long i = 0; i < src_size; i++)
   {
      src[i * 4] = 255;
      src[i * 4 + 1] = 255;
      src[i * 4 + 2] = 255;
      src[i * 4 + 3] = 255;
   }
}

enum mapToUse
{
   out,
   path
};

struct Block
{
   int startX;
   int startY;
   int endX;
   int endY;
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

   vector<Block> blockedOutRooms = {};

   MapGen(
       unsigned char *_map,
       uint _width,
       uint _height,
       bool _isCoalMine,
       bool _shouldBlockOutRooms,
       unsigned int *_randomMaterials,
       int _worldX,
       int _worldY) : width(_width),
                      height(_height),
                      out_map(_map),
                      isCoalMine(_isCoalMine),
                      shouldBlockOutRooms(_shouldBlockOutRooms),
                      randomMaterials(_randomMaterials),
                      worldX(_worldX),
                      worldY(_worldY)
   {
      path_map = (unsigned char *)malloc(3 * width * height);
      memcpy(path_map, out_map, 3 * width * height);

      if (shouldBlockOutRooms)
      {
         blockedOutRooms.reserve(32);
      }
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

   void reset()
   {
      nodeList.clear();
      blockedOutRooms.clear();
   }

   bool hasPath()
   {
      usemap = out;
      if (shouldBlockOutRooms)
      {
         blockOutRooms(COLOR_BLACK, COLOR_WHITE);
      }

      if (isCoalMine)
      {
         doCoalMineHax();
      }

      memcpy(path_map, out_map, 3 * width * height);

      usemap = path;
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
      if (isCoalMine)
      {
         undoCoalMineHax();
      }
      if (shouldBlockOutRooms)
      {
         fillBlockedRooms(COLOR_BLACK);
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
      int fill_x_from = (BIOME_PATH_FIND_WORLD_POS_MIN_X - worldX * 512.0) / 10;
      int fill_x_to = fill_x_from + (BIOME_PATH_FIND_WORLD_POS_MAX_X - BIOME_PATH_FIND_WORLD_POS_MIN_X) / 10;
      return worldY < 29 && fill_x_to > 0 && fill_x_from > 0 && width > fill_x_from && fill_x_to < width + fill_x_from;
   }

   int fillMainPath()
   {
      unsigned char *map = GetMap();
      int fill_x_from = (BIOME_PATH_FIND_WORLD_POS_MIN_X - worldX * 512.0) / 10;
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

   void blockOutRooms(unsigned long passableColor, unsigned long targetColor)
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
         uint x = pos % width;
         uint y = pos / width;

         int startX = x + 1;
         int endX = x + 1;
         int startY = y + 1;
         int endY = y + 1;
         bool foundEnd = false;
         while (!foundEnd && endX < width)
         {
            long c = getPixelColor(map, width, endX, startY);
            if (c == passableColor || ShadeOfGrey(c, 0x32))
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
            if (c == passableColor || ShadeOfGrey(c, 0x32))
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
         blockedOutRooms.push_back(Block(startX, startY, endX, endY));
         fill(map, width, startX, endX, startY, endY, targetColor);
      }
   }

   void fillBlockedRooms(unsigned long color)
   {
      unsigned char *map = GetMap();
      for (auto &block : blockedOutRooms)
      {
         fill(map, width, block.startX, block.endX, block.startY, block.endY, color);
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

std::unordered_map<unsigned long, stbhw_tileset *> ts_map = {};

std::unordered_map<std::string, image> impl_map = {};

class MapHandler
{
public:
   uint width;
   uint height;
   unsigned long color;
   bool isCoalMine;
   bool shouldBlockOutRooms;
   unsigned int *randomMaterials;
   int worldX;
   int worldY;

   unsigned char *map;
   unsigned char *bigMap;

   MapHandler(
       uint _width,
       uint _height,
       unsigned long _color,
       bool _isCoalMine,
       bool _shouldBlockOutRooms,
       int _randomMaterials,
       int _worldX,
       int _worldY) : width(_width),
                      height(_height),
                      color(_color),
                      isCoalMine(_isCoalMine),
                      shouldBlockOutRooms(_shouldBlockOutRooms),
                      randomMaterials(reinterpret_cast<unsigned int *>(_randomMaterials)),
                      worldX(_worldX - WORLD_OFFSET_X),
                      worldY(_worldY - WORLD_OFFSET_Y)

   {
      map = (unsigned char *)malloc(_width * _height * 4);
      bigMap = (unsigned char *)malloc(_width * 10 * _height * 10 * 4);
   }
   ~MapHandler()
   {
      free(map);
      free(bigMap);
   }

   void generate_map(
       std::string rgba_tiles_b64)
   {
      if (rgba_tiles_b64 == "")
      {
         whiteout(map, width, height);
         return;
      }
      stbhw_tileset *ts;
      if (ts_map.contains(color))
      {
         ts = ts_map[color];
      }
      else
      {
         auto _ts = new stbhw_tileset();
         auto tiles = load_png(rgba_tiles_b64);
         unsigned char *rgb_tiles_data = (unsigned char *)malloc(3 * tiles.width * tiles.height);
         rgbaToRgb(tiles.image, rgb_tiles_data, tiles.width, tiles.height);
         int success = stbhw_build_tileset_from_image(_ts, rgb_tiles_data, tiles.width * 3, tiles.width, tiles.height);
         if (!success)
         {
            printf("stbhw_build_tileset_from_image error: %s\n", stbhw_get_last_error());
            return;
         }
         free(rgb_tiles_data);
         ts_map[color] = _ts;
         ts = _ts;
      }

      NollaPrng rng = GetRNG(width);

      int tries = 0;
      long mod_malloc_amount = 3 * width * (height + 4);
      unsigned char *res = (unsigned char *)malloc(mod_malloc_amount);
      long malloc_amount = 3 * width * height;

      unsigned char *rgb_result = (unsigned char *)malloc(malloc_amount);

      bool hasPath = false;
      do
      {
         if (tries >= 100)
         {
            break;
         }

         NollaPrng rng2 = NollaPrng(rng.NextU());

         int success = stbhw_generate_image(ts, NULL, res, width * 3, width, height + 4, [&rng2]()
                                            { return rng2.NextU(); });
         if (!success)
         {
            printf("stbhw_generate_image error: %s\n", stbhw_get_last_error());
            return;
         }

         int num_bytes = 4 * 3 * width;
         memcpy(rgb_result, &res[num_bytes], mod_malloc_amount - num_bytes);

         MapGen mg = MapGen(rgb_result, width, height, isCoalMine, shouldBlockOutRooms, randomMaterials, worldX, worldY);

         hasPath = mg.hasPath();
         if (hasPath)
         {
            mg.finalize();
         }
         mg.reset();
         tries++;
         // } while (tries <= 0);
      } while (hasPath == false);

      // Cleanup
      free(res);
      rgbToRgba(rgb_result, map, width, height);
      free(rgb_result);
   }

   void iterateMap(int x, int y, emscripten::val cb)
   {
      // We need to get the offset for the map in the global scope
      // so that we get the color of the correct pixels
      // ex: the map's top left corner is on chunk +2, +2, then we need to
      // offset the pixels by 2 chunks to the left and up.

      // This is the way it is because 512 doesn't divide by 10 evenly
      // and so the chunks from WANG are not always square, and start from (gx,gy 0,0)
      // (top left corner of the map)
      auto g = GetGlobalPos(x, y);
      int gx = g[0];
      int gy = g[1];

      int cw = GetWidthFromPix(x, x + 1);
      int dw = GetWidthFromPix(worldX + WORLD_OFFSET_X, x);

      int ch = GetWidthFromPix(y, y + 1);
      int dh = GetWidthFromPix(worldY + WORLD_OFFSET_Y, y);

      // printf("x %i, y %i, worldX %i, worldY %i, cw %i, ch %i, dw %i, dh %i, gx %i, gy %i, width %i, height %i\n", x, y, worldX, worldY, cw, ch, dw, dh, gx, gy, width, height);

      for (int px = 0; px < cw; px += 1)
      {
         for (int py = 0; py < ch; py += 1)
         {
            unsigned long color = getRGBAPixelColor(map, width, dw + px, dh + py);
            if (color == 0xFF || color == 0xFFFFFFFF)
            {
               continue;
            }
            // floodFill(bigMap, width * 10, height * 10, gx + px * 10, gy + py * 10, color, COLOR_BLACK);
            int lll = cb.call<int>("call", 0, gx + px * 10, gy + py * 10, color);
         }
      }
   }

   bool somePixels(int _m, int w, int h, int step, emscripten::val cb)
   {
      unsigned char *m = reinterpret_cast<unsigned char *>(_m);
      unsigned long maxPos = w * h;
      for (unsigned long pos = 0; pos < maxPos; pos += step)
      {
         unsigned long color = getRGBAPixelColor(m, pos * 4);
         if (color == 0xFF || color == 0xFFFFFFFF)
         {
            continue;
         }
         uint x = pos % w;
         uint y = pos / w;
         bool ans = cb.call<bool>("call", 0, x, y, color);
         if (ans)
         {
            return true;
         }
      }
      return false;
   }

   std::string getMap()
   {
      return unload_png(map, width, height);
   }

   void toBig()
   {
      scaleImage(map, width, height, bigMap, 10);
   }

   void drawImageData(std::string path, std::string impl, int gx, int gy, int _colorToMaterialTable)
   {
      image img;
      if (impl_map.contains(path))
      {
         img = impl_map[path];
      }
      else
      {
         auto _i = load_png(impl);
         impl_map[path] = _i;
         img = _i;
      }

      // int tx = (gx) / 512;
      int tx = (gx + 5) / 512;
      // int rx = (gx) % 512;
      int rx = (gx + 5) % 512;

      // int ty = (gy) / 512;
      int ty = (gy + 13) / 512;
      // int ry = (gy) % 512;
      int ry = (gy + 13) % 512;

      int old_px = (tx - worldX) * 512 + rx;
      int old_py = (ty - worldY) * 512 + ry;

      int px = gx - worldX * 512;
      int py = gy - worldY * 512;

      // printf("drawImageData path: %s, gx: %i, gy: %i, px: %i, py: %i, old_px: %i, old_py: %i\n", path.c_str(), gx, gy, px, py, old_px, old_py);

      const std::map<unsigned long, unsigned long> &colorToMaterialTable = *reinterpret_cast<std::map<unsigned long, unsigned long> *>(_colorToMaterialTable);

      // Check that the image won't go out of bounds
      // if (px + img.width > width * 10 || py + img.height > height * 10)
      // {
      //    printf("drawImageData out of bounds %i %i %i %i\n", px, py, img.width, img.height);
      //    return;
      // }
      // if (px < 0 || py < 0)
      // {
      //    printf("drawImageData out of bounds %i %i %i %i\n", px, py, img.width, img.height);
      //    return;
      // }

      for (int y = 0; y < img.height; y++)
      {
         for (int x = 0; x < img.width; x++)
         {
            unsigned long offset = getPos(img.width, img.channels, x, y);
            unsigned long pixel = getRGBAPixelColor(img.image, offset);
            bool isTransparent = isRGBATransparent(pixel);
            if (pixel == 0xFF || isTransparent) // 0x000000FF (black)
            {
               continue;
            }

            auto it = colorToMaterialTable.find(pixel);
            auto toColor = pixel;
            if (it != colorToMaterialTable.end())
            {
               toColor = it->second;
            }
            setRGBAPixelColor(bigMap, width * 10, px + x, py + y, toColor);
         }
      }
   }
};

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
