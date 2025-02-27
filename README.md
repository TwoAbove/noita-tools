# Noitool

A web app for many things Noita.

It helps you get a specific seed for your specific needs.

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
- Seed search with customizable complexity, with multi-machine support

Table of Contents:

- [Connecting as a compute node](#connecting-as-a-compute-node)
- [Development](#development)
- [Related projects](#related-projects)
- [Licensing](#licensing)

## Connecting as a compute node

### Prerequisites

- The machine should have node installed (ideally v18.6+) and npm.

### Installing and connecting

#### Docker

You can use docker to simply spin up a compute node:

```bash
docker run -it -e ghcr.io/twoabove/noitool-console-search:latest
```

<!-- docker run -it --restart=always --pull=always ghcr.io/twoabove/noitool-console-search:latest-dev -->

Or for dev

```bash
docker run -it -e NOITOOL_URL=https://dev.noitool.com/ ghcr.io/twoabove/noitool-console-search:latest-dev
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
- `--userId` `NOITOOL_USER_ID`: The user to connect as (it's your patreon id)
- `--exit` `NOITOOL_EXIT` default `false`. Add if you want the worker to exit if there are no more jobs.
- `--minRunTime` `NOITOOL_MIN_RUN_TIME` default `0`. This minimum amount of time (in seconds) that the worker will run for. If there are no more jobs, it will exit after this time. A value of 0 means that this is disabled.

#### Automating deployment of Noitool to several machines

You can use the `deploy_to_servers.sh` script to deploy to several machines. You need to create `.servers` file with the following format:

```csv
user@server1,,main_user_id
user@server2,dev_user_id,
```

This is a headerless csv file with the following columns: `ssh,main_user_id,dev_user_id`.

Note the missing entry for the dev user id on server1 and the missing entry for the main user id on server2. That means that server 1 will connect to the main instance and server 2 will connect to the dev instance without both searchers competing for CPU time.

Then run `./deploy_to_servers.sh` to deploy to all servers.

## Technical details and implementation details that I found interesting

Check out the [ARCHITECTURE.md](ARCHITECTURE.md) file for a more detailed overview of the project structure and key components.

## Development

If this is your first time working with this repo, you should read the [ARCHITECTURE.md](ARCHITECTURE.md) file to get a better understanding of the project structure before jumping into development.

### Setup

I use linux or mac for development, so I can't guarantee that everything works on windows. On windows, you can use WSL2 to run the dev environment.

Prerequisites:

- Docker (for compose)
- Node
- Bun (for running the server)
- `chokidar` (`npm install -g chokidar-cli`)
- [emscripten](https://emscripten.org/docs/getting_started/downloads.html) is installed if you want to work with the c++ code
- [Nota data](https://noita.wiki.gg/wiki/Modding#Extracting_data_files) if you want to modify the data files. Place the data files in `dataScripts/noita-data`

Before running `npm run dev`, please copy the `.env.example` file to `.env` and fill in the values. For non-patreon and discord features, you can leave the file as-is.

Also, run `docker compose up -d` to easily spin up a local db instance.

### Noita data

You will need to unpack Noita wak data (see [here](https://noita.wiki.gg/wiki/Modding#Extracting_data_files)) and copy/link several things into the `dataScripts/noita-data` folder. Note that `translations` and `fonts` are in the main Noita folder, not in the `Nolla_Games_Noita` folder.
Here is the list of required directories: `data`, `translations`, `fonts`.

To create a symlink, run `ln -s <path to noita data> dataScripts/noita-data/data`.

For debian, the commands would look like this:

```sh
ln -s ~/.steam/debian-installation/steamapps/compatdata/881100/pfx/drive_c/users/steamuser/AppData/LocalLow/Nolla_Games_Noita/data dataScripts/noita-data/data
ln -s ~/.steam/debian-installation/steamapps/common/Noita/data/translations dataScripts/noita-data/translations
ln -s ~/.steam/debian-installation/steamapps/common/Noita/data/fonts dataScripts/noita-data/fonts
```

Use the `./dataScripts/full_parse.sh` script to clean and parse the data files.

### emscripten installation and required changes

For emscripten, some edits need to be done to enable the closure compiler.

I recommend using the git repo to install emsdk. Install the latest version.

Installation (after emscripten): `npm i`

When running `npm run dev` a build script will listen to changes in `.cpp` files and rebuild the wasm files.

For vscode to work with the c++ files, install the [c++ extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools).

Then, go to `C/C++: Edit configurations (UI)` and add `<emscripten installation path>/upstream/emscripten/cache/**` to `Include path` so that vscode can find the emscripten headers. They will be available after the first build.

## Related projects

(in alphabetical order)

- <https://github.com/cr4xy/noita-seed-tool>
- <https://github.com/Dadido3/noita-mapcap>
- <https://github.com/pudy248/NoitaMapViewer>
- <https://github.com/SaphireLattice/noita_unicorn>
- <https://noitamap.com>

## Licensing

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
