const rules = {
  id: "1",
  type: "and",
  rules: [
    {
      id: "2",
      type: "map",
      val: {
        coalmine: {
          pos: {
            x: 34,
            y: 15,
          },
          search: [
            "data/biome_impl/coalmine/physics_swing_puzzle.png",
            "data/biome_impl/coalmine/receptacle_oil.png",
            "data/biome_impl/coalmine/oiltank_puzzle.png",
          ],
          funcs: ["load_pixel_scene2", "load_pixel_scene", "load_oiltank"],
        },
        excavationSite: {
          pos: {
            x: 34,
            y: 17,
          },
          search: [
            "data/biome_impl/excavationsite/meditation_cube.png",
            "data/biome_impl/excavationsite/receptacle_steam.png",
          ],
          funcs: ["spawn_meditation_cube", "load_pixel_scene4_alt"],
        },
        snowCave: {
          pos: {
            x: 34,
            y: 21,
          },
          search: ["data/biome_impl/snowcave/receptacle_water.png", "data/biome_impl/snowcave/buried_eye.png"],
          funcs: ["load_pixel_scene", "load_pixel_scene3"],
        },
        snowCastle: {
          pos: {
            x: 34,
            y: 25,
          },
          search: ["data/biome_impl/snowcastle/kitchen.png"],
          funcs: ["load_pixel_scene2"],
        },
        vault: {
          pos: {
            x: 34,
            y: 31,
          },
          search: ["data/biome_impl/vault/lab_puzzle.png"],
          funcs: ["load_pixel_scene2"],
        },
      },
    },
  ],
  selectedRule: "search",
};

const { handler } = require("../../lambda-build/lambdaSearch");

const start = performance.now();

// fetch(`https://usywpdm5ejpyljndd7l3pt6pky0kydal.lambda-url.us-east-1.on.aws/`, {
//   method: "post", body: JSON.stringify({ rules, from: 1, to: 1000 })
// }).then(async res => {
//   const end = performance.now();
//   console.log((await res.text()));
//   const ans = await res.json();
//   console.log(ans);
//   console.log(end - start, 'ms');
// });

handler({ body: { rules, from: 1, to: 1000 } })
  .then(res => {
    const end = performance.now();
    console.log(res);
    console.log(end - start, "ms");
  })
  .catch(e => console.error(e));
