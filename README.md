# Noitool

A web app for many things Noita.

Helps you get a specific seed for your specific needs.

Current features include:

- Holy mountain info
- Shop type and contents
- Pacifist chest contents
- Perks and perk rerolls
- Starting setup
- Water Cave layout
- Lively Concoction and Alchemic Precursor recipes
- Fungal Shifts
- Live seed checking during play using machine learning computer vision
- Seed search with customizable complexity

## Connecting as a compute node

### Prerequisites

- The machine should have node installed (ideally v18.6+) and npm.
- Follow to <https://www.noitool.com/?profile=true> and link your patreon account. Under your patreon username, there will now be an id like `6456aff2478c4f8f91701018`
- Install `chokidar` (`npm install -g chokidar-cli`)

### Installing and connecting

#### Docker

You can use docker to simply spin up a compute node:

```bash
docker pull ghcr.io/twoabove/noitool-console-search:latest && docker run -it -e NOITOOL_USER_ID=xxx ghcr.io/twoabove/noitool-console-search:latest
```

Or for dev

```bash
docker pull ghcr.io/twoabove/noitool-console-search:latest-dev && docker run -it -e NOITOOL_USER_ID=xxx -e NOITOOL_URL=https://dev.noitool.com/ ghcr.io/twoabove/noitool-console-search:latest-dev
```

#### CLI

To connect to noitool as a compute node, follow these steps:

```bash
git clone https://github.com/TwoAbove/noita-tools.git
cd noita-tools
git checkout master # for https://www.noitool.com
# git checkout develop # for https://dev.noitool.com
npm install --frozen-lockfile
npm run console-build
npm run console-search --userId <your id>
```

console-search args (or env vars):

- `--url` `NOITOOL_URL`: default <https://www.noitool.com/>. Change to <https://dev.noitool.com/> for the dev build
- `--cores` `NOITOOL_CORES`: default `os.cpus()`. The amount of cores to use.
- `--userId` `NOITOOL_USER_ID`: The user to connect as.
- `--exit` `NOITOOL_EXIT` default `false`. Add if you want the worker to exit if there are no more jobs.
- `--minRunTime` `NOITOOL_MIN_RUN_TIME` default `0`. This minimum amount of time (in seconds) that the worker will run for. If there are no more jobs, it will exit after this time. A value of 0 means that this is disabled.

## Technical details and implementation details that I found interesting

WASM is shaping up to be a very interesting technology. In our use-case, the communication overhead of JS <-> WASM is usually worth it,
but it's the main vector of performance improvements, since we're constantly bouncing between JS and WASM for noita_random calls.

Many parts of the critical core game functions that are needed to generate everything are written in C++.
The c++ code is then compiled to wasm and is run in web workers (and partly in the main thread).
The performance improvements are 20-fold by transferring seed functions (like randoms and lc & ap recipes) from a typescript implementation to c++, even with the call overhead from worker -> wasm code.

In Noita, for map generation, [wang tiles](https://github.com/nothings/stb/blob/master/stb_herringbone_wang_tile.h) are used. In lua/xml code, **A**RGB color formats are used for color targeting. In browsers, in general, RGB**A** is used. The transformed colors (in data json) use RGB**A** to homogenize color format.

Credits to the developers of similar tools:
The code for finding LC and AP values was transferred from [noita_unicorn](https://github.com/SaphireLattice/noita_unicorn)'s `Program.cs` from c# to c++.
Also, I took inspiration from [cr4xy](https://cr4xy.dev/noita/) for extra features. You rock! <3

## Development

I use linux or mac for development, so I can't guarantee that everything works on windows. On windows, you can use WSL2 to run the dev environment.

Prerequisites:

- Docker (for compose)
- Node
- fswatch
- [emscripten](https://emscripten.org/docs/getting_started/downloads.html) is installed if you want to work with the c++ code
- [Nota data](https://noita.wiki.gg/wiki/Modding#Extracting_data_files) if you want to modify the data files

Before running `npm run dev`, please copy the `.env.example` file to `.env.local` and fill in the values. For non-patreon and discord features, you can leave the file as-is.

Also, run `docker compose up -d` to easily spin up a local db instance.

### Noita data

You need to clean the Noita data a bit before running dataScripts. After extracting noita wak, in the noita data directory, run

```sh
find . -type f -not -path '*/\.*' -exec sed -i 's/----------------------//g' {} +;
find . -type f -not -path '*/\.*' -exec sed -i 's/<!------------ MATERIALS -------------------->/<!-- MATERIALS -->/g' {} +;
find . -type f -not -path '*/\.*' -exec sed -i 's/<!------------ MATERIALS ------------------ -->/<!-- MATERIALS -->/g' {} +;
find . -type f -not -path '*/\.*' -exec sed -i 's/<!-- attack_ranged_min_distance="60" -->//g' {} +;
find . -type f -not -path '*/\.*' -exec sed -i 's/<!---------------- shield ---------------- -->//g' {} +;
find . -type f -not -path '*/\.*' -exec sed -i 's/<!-- fuse_tnt durability is 11 so this is capable of destroying it -->//g' {} +;
tac $NOLLA_PATH/entities/misc/eradicate.xml | sed '0,/<Entity>$/s//<\/Entity>/' | tac >$NOLLA_PATH/entities/misc/eradicate.xml;
```

to fix comments for the xml parser

For emscripten, some edits need to be done to enable the closure compiler:

### emscripten installation and required changes

I recommend using the git repo to install emsdk. Install the latest version.

Installation (after emscripten): `npm i`

When running `npm run dev` a build script will listen to changes in `.cpp` files and rebuild the wasm files.

For vscode to work with the c++ files, install the [c++ extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools).

Then, go to `C/C++: Edit configurations (UI)` and add `<emscripten installation path>/upstream/emscripten/cache/**` to `Include path` so that vscode can find the emscripten headers.
