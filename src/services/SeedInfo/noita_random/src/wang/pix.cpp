#pragma once

#include "../noita_random.cpp"

const unsigned long COLOR_PURPLE = 0x7f007f;
const unsigned long COLOR_RED = 0xff0000;
const unsigned long COLOR_BLACK = 0x000000;
const unsigned long COLOR_WHITE = 0xffffff;
const unsigned long COLOR_YELLOW = 0xffff00;

// Extra traversable colors
const unsigned long COLOR_COFFEE = 0xc0ffee;
const unsigned long COLOR_FROZEN_VAULT_MINT = 0xcff7c8;
const unsigned long COLOR_HELL_GREEN = 0x8aff80;

unsigned long createRGB(const unsigned char r, const unsigned char g, const unsigned char b)
{
   return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

unsigned long createRGBA(const unsigned char r, const unsigned char g, const unsigned char b, const unsigned char a)
{
   return ((r & 0xff) << 24) | ((g & 0xff) << 16) | ((b & 0xff) << 8) | (a & 0xff);
}

unsigned long getPos(const uint w, const uint s, const uint x, const uint y)
{
   return s * (w * y + x);
}

unsigned long getPixelColor(const unsigned char *map, unsigned long pos)
{
   unsigned char r = map[pos];
   unsigned char g = map[pos + 1];
   unsigned char b = map[pos + 2];
   return createRGB(r, g, b);
}

unsigned long getPixelColor(const unsigned char *map, const uint w, const uint x, const uint y)
{
   unsigned long pos = getPos(w, 3, x, y);
   return getPixelColor(map, pos);
}

bool ShadeOfGrey(const unsigned long color, const unsigned char limit)
{
   unsigned char r = (color >> 16) & 0xFF;
   unsigned char g = (color >> 8) & 0xFF;
   unsigned char b = color & 0xFF;

   return r <= limit && (r == g) && (g == b) && color != COLOR_BLACK && color != COLOR_WHITE;
}

bool isRGBATransparent(const unsigned long color)
{
   unsigned char a = color & 0xFF;
   return a == 0;
}

unsigned long getRGBAPixelColor(const unsigned char *map, unsigned long pos)
{
   unsigned char r = map[pos];
   unsigned char g = map[pos + 1];
   unsigned char b = map[pos + 2];
   unsigned char a = map[pos + 3];
   return createRGBA(r, g, b, a);
}

unsigned long getRGBAPixelColor(const unsigned char *map, const uint w, const uint x, const uint y)
{
   unsigned long pos = getPos(w, 4, x, y);
   return getRGBAPixelColor(map, pos);
}

void setPixelColor(unsigned char *map, unsigned long pos, unsigned long color)
{
   unsigned char r = ((color >> 16) & 0xff);
   unsigned char g = ((color >> 8) & 0xff);
   unsigned char b = ((color)&0xff);
   map[pos] = r;
   map[pos + 1] = g;
   map[pos + 2] = b;
}
void setRGBAPixelColor(unsigned char *map, unsigned long pos, unsigned long color)
{
   unsigned char r = ((color >> 24) & 0xff);
   unsigned char g = ((color >> 16) & 0xff);
   unsigned char b = ((color >> 8) & 0xff);
   unsigned char a = ((color)&0xff);
   map[pos] = r;
   map[pos + 1] = g;
   map[pos + 2] = b;
   map[pos + 3] = a;
}

void setPixelColor(unsigned char *map, uint w, uint x, uint y, unsigned long color)
{
   unsigned long pos = getPos(w, 3, x, y);
   setPixelColor(map, pos, color);
}
void setRGBAPixelColor(unsigned char *map, uint w, uint x, uint y, unsigned long color)
{
   unsigned long pos = getPos(w, 4, x, y);
   setRGBAPixelColor(map, pos, color);
}
