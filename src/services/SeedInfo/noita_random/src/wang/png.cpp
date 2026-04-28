#pragma once

#include <stdint.h>
#include <stdlib.h>

void zero_out(uint8_t *data, uint l)
{
  if (data == NULL)
  {
    return;
  }
  for (uint i = 0; i < l; i += 4)
  {
    uint8_t r = data[i + 0];
    uint8_t g = data[i + 1];
    uint8_t b = data[i + 2];
    uint8_t a = data[i + 3];
    if (a == 0 && r == 255 && g == 255 && b == 255)
    {
      data[i + 0] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
  }
}

struct image
{
  int width;
  int height;
  int channels;
  stbi_uc *image;
};

image load_png_bytes(const unsigned char *data, int len)
{
  int width = 0;
  int height = 0;
  int channels = 0;
  stbi_uc *img = stbi_load_from_memory(data, len, &width, &height, &channels, 4);
  if (img == NULL)
  {
    return image{0, 0, 0, NULL};
  }

  channels = 4;
  zero_out(img, width * height * channels);
  return image{width, height, channels, img};
}

void free_png_image(image *img)
{
  if (img == NULL)
  {
    return;
  }
  stbi_image_free(img->image);
  img->image = NULL;
  img->width = 0;
  img->height = 0;
  img->channels = 0;
}

void scaleImage(unsigned char *src, uint src_width, uint src_height, unsigned char *dest, unsigned char scale)
{
    int dest_width = src_width * scale;
    int dest_height = src_height * scale;

    for (int y = 0; y < dest_height; y++)
    {
        int src_y = y / scale;

        for (int x = 0; x < dest_width; x++)
        {
            int src_x = x / scale;

            int src_index = (src_y * src_width + src_x) * 4;
            int dest_index = (y * dest_width + x) * 4;

            dest[dest_index + 0] = src[src_index + 0];
            dest[dest_index + 1] = src[src_index + 1];
            dest[dest_index + 2] = src[src_index + 2];
            dest[dest_index + 3] = src[src_index + 3];
        }
    }
}
