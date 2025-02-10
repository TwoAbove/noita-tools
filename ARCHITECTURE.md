# Architecture Overview

This document gives an outline of how this project is structured and how its components interact. It covers the frontend, backend, and data processing scripts, as well as how they communicate with each other. It will also highlight some interesting issues I encountered during development.

The project has 3 distict parts: the frontend, the backend, and dataScripts, and a secret fourth part: the compute client. We'll go over each of them in detail.

- [Overview](#overview)
- [DataScripts](#datascripts)
- [Backend](#backend)
- [Frontend](#frontend)
  - [Where does data come from and where does it go?](#where-does-data-come-from-and-where-does-it-go)
  - [Displaying game data](#displaying-game-data)
  - [Searching for seeds](#searching-for-seeds)
  - [A small rant about Maps](#a-small-rant-about-maps)
- [Old man yells at cloud](#old-man-yells-at-cloud)
- [Things I found interesting](#things-i-found-interesting)

## Overview

Noitool is a web app, built with React. The backend server is built with Express.js and uses Socket.IO for real-time communication. The data processing scripts are written in Node.js and are used to transform raw game data into a format usable by the app. The frontend is a single-page application (SPA) built with React and Vite.

## DataScripts

This is a collection of scripts that process Noita game data (see [Data.wak](https://noita.fandom.com/wiki/Data.wak) and [how to extract it](https://noita.fandom.com/wiki/Modding#Extracting_data_files)). The main things that we generate with these scripts are the various `.json`s (in `src/services/SeedInfo/data`) as well as the i18n data (in `public/locales`). Best to just get a quick read of them to get a feel for what they do. Currently, the script outputs both array and key-value pair variants of the data files. This is not ideal, and it should be unified to one format.

The best way to explore dataScripts is to look at `dataScripts/full_parse.sh` and look at what it does. The only non-intuitive action in that file is the `mapsToObj` call, which is actually a script that generates map handler templates + entity data from the game's xml files. It's done together becuase there is significant overlap in the definitions for maps and entities. It does xml parsing and traversal, with some parts parsing and traversing lua code. That's because Noita's entity generation is defined in lua code that's called from a map xml. For more info, you can check out [how biome definition works](https://noita.fandom.com/wiki/Modding:_Making_a_custom_environment).

## Backend

This part is, thankfully, easy. Noitool is very backend-lite. The backend is a simple express server that serves the frontend (in production), provides a few endpoints for the frontend to interact with, and serves a websocket for the compute clients to connect to. It lives in the `server` directory. The compute clients are the real workhorses of the project, and they do the heavy lifting of seed solving. The backend also has a few endpoints for the frontend to interact with, like the daily seed endpoint.

There, the main files are `server/server.mjs` and `io/compute.mjs`. The former sets up the express server, middleware, and routes, and the latter handles communication between compute instances.

The frontend is fully usable without the backend running. The only thing that won't work is fetching the daily seed.

## Frontend

This is the bread-and-butter of the project. The frontend is a single-page application (SPA) built with React using Vite. Before diving into the code, it's best to first understand how the data is generated and used.

### Where does data come from and where does it go?

Noita is a roguelite with a proceduraly generated world. The world is generated from a seed (`worldSeed`). This seed is static for every game. All other randomness is derived from this and is deterministic. This means that if you know the seed, you can predict everything (well, most things - more on that later) that will happen in the game. Because of that, we need a set of scripts that will take this seed and all of the game's data-of-interest. Then, we can display it. And, since we can deterministically generate it, we can also search for seeds that match certain criteria.

The random number generation and map generation is extracted from the game's decompiled binary. The rest of the data is extracted from the game's data files. This document will not go over the decompilation and reverse-engineering process, but you can check out the `noita_random` directory for the wasm code that's used for both random number generation and map generation. I would recommend [Ghidra](https://ghidra-sre.org/) for decompilation (thank you, NSA, for using my taxes for something this awesome) with the c++ plugin.

As a sidenote, searching for seeds is [embarrassingly parallel](https://en.wikipedia.org/wiki/Embarrassingly_parallel), which is why we can distribute the work to multiple cores and compute clients (with caveats).

All data generation lives in `src/services/SeedInfo`. The root of it is the `src/services/SeedInfo/infoHandler/index.ts` where the GameInfoProvider lives. Don't be alarmed by the size of this file. It's mostly because of the async imports of the different InfoProviders that are available. The InfoProviders are the classes that actually do the data generation. They are split into different files based on the type of data they generate. For example, `src/services/SeedInfo/infoHandler/InfoProviders/Perk` generates perk data. Each info provider has a `provide()` method that returns the data, as well as a `test()` method that is used to check if the provided data matches the search criteria.

Each info provider class has a number of dependencies. The main one is `src/services/SeedInfo/random` - this is the main module that generates the pseudorandom numbers used throughout the game. You can check out `src/services/SeedInfo/random/random.ts` and `src/services/SeedInfo/noita_random/src/wasm_in.cpp` to see the interface. The gist is alway the same - parts of the code first call `SetRandomSeed()` with 2 values (usually x and y coordinates), and then call the various `Random()` functions and their flavors. Under the hood, they are all slight variations or abstractions of the base `Random()` call. This is why not everying is deterministic - some parts of the game use the `SetRandomSeed()` function with non-set-coordinates, which means that the outcome is also dependent on something in the game state (one example are the bosses, where the death coordinates are used).

After the data is generated, we can display it.

### Displaying game data

The view layer lives in `src/components`. That's where the whole UI is defined. Since Noitool has several features, like `Info`, `Search`, `Compute`, and `Live`, the components are split into folders based on the feature they are part of.

`Info` is by far the largest, since it defines the full game info presentation and interactivity logic that's available. Each component in that view displays the different "chunks" of data available. Best to look at `src/components/SeedInfo/SeedInfo.tsx` to get an idea about the components.

`src/components/LiveSeedStats` is the `Live Game Helper`, which uses [Tesseract](https://tesseract.projectnaptha.com/) to read the game's screen and extract the seed from it.

`src/components/Compute` is the compute client management UI. It hosts the compute client code, which is just a headless searcher component that connects to the backend and listens for work.

`src/components/SearchSeeds` is another big one - this is the search UI. Here, we construct a rule tree `src/services/SeedInfo/infoHandler/IRule.ts`. This is then passed to the searcher, which we will go over in a bit.

### Searching for seeds

`src/services/seedSearcher.ts` is the base component that does searches. The approach is straightforward - we load a GameInfoProvider, then, as input, we get a seed range and the ruleset. The searcher then iterates on the seed range and checks if the seed matches the ruleset. If it does, it's added to the results. The results are then sent to be handled by the main thread.

Noitool has 2 seed serchers - in-browser and in-node searchers. You can find both entrypoints in `src/workers`. The `ConsoleSearch` `src/consoleSearch.ts` is what gets bundled into the docket container and can be run separately. For the browser, the search is done using WebWorkers. There are some quirks with interfacing with WebWorkers, however, but there are comments in the code that explain them.

Check out `src/components/SearchSeeds/SearchContext.tsx` to see how the search is managed in the frontend. (This honestly should be a stateful class)

### A small rant about Maps

Map generation is unfinished, and doesn't work 100% of the time. I've tried my best to make it work, but there are edge cases that I haven't been able to solve. The `src/services/SeedInfo/infoHandler/InfoProviders/Map` directory holds all of the biome generation classes that are transpiled from lua code to typescript. It's definitely possible to use the AST to directly convert, but right now it's a half-manual process. You can check out `dataScripts/src/mapsToObj/generateMaps.ts` and `dataScripts/src/mapsToObj/generateMapImpls.ts` to see how the conversion is done.

I'm 100% sure about [Wang generation](https://noita.fandom.com/wiki/World_generation#Herringbone_Wang_Tiles), though. The part that's not 100% accurate is the wang -> tile conversion and coords in "game space". If that part is solved, **we can know full map information for each seed** in noitool, too. Note, however, that enemy generation requires `RaytracePlatforms` to be defined, but that, from the looks of things, requires the actual terrain to be generated, which I haven't cracked.

## Old man yells at cloud

Noitool is not fully finished, as my goal was fully solving every gameplay-related deterministic thing Noita had. The end state requires that the map generation is fully solved, and that `RaytracePlatforms()` is solved. That would give us all of the required data to show everything that's possible in the game. I think a full refactor of how Map generation is done is needed, as my root assumption of generating it biome-wise was incorrect. The way the game works is that it generates tiles _around the camera position_, and generating biomes only when needed. For example, LoadPixelScene can draw entities outsite of its tile (and it would work). An example of this is Holy Mountains and spawn_altar_top. The portal and possible liquid flood are defined and drawn on top of the Holy Mountains, but they are inside of the upper biome.

A grievance I have with wasm and c++ is that I didn't split it out enough. I would like the `map` and base `noita_random` to be separate. That would ease the wasm loading and make the code more modular.

Another grievance I have is that I did not focus enough on deduping the UI. I think refactoring the UI layer and interactions out of it would make any future developments easier. In the current state, many components use GameInfoProvider, but generate the data inline. We should refactor this so that it is fully decoupled from the UI, and the UI just emits events that are handled by a separate layer. This will then allow us to mock the data and test and develop the UI layer separately.

## Things I found interesting

WASM is a very cool technology. In our use-case, the communication overhead of JS <-> WASM is usually worth it, but it's the main vector of performance improvements, since we're constantly bouncing between JS and WASM for noita_random calls.

Many parts of the critical core game functions that are needed to generate everything are written in C++.
The c++ code is then compiled to wasm and is run in web workers (and partly in the main thread).
The performance improvements are 20-fold by transferring seed functions (like randoms and lc & ap recipes) from a typescript implementation to c++, even with the call overhead from worker -> wasm code.

In Noita, for map generation, [wang tiles](https://github.com/nothings/stb/blob/master/stb_herringbone_wang_tile.h) are used. In lua/xml code, **A**RGB color formats are used for color targeting. In browsers, in general, RGB**A** is used. The transformed colors (in data json) use RGB**A** to homogenize color format.

Credits to the developers of similar tools:
The code for finding LC and AP values was transferred from [noita_unicorn](https://github.com/SaphireLattice/noita_unicorn)'s `Program.cs` from c# to c++.
Also, I took inspiration from [cr4xy](https://cr4xy.dev/noita/) for extra features. You rock! <3

String equality when transferring search configs through web workers is a pain. There is a gotcha of `new String('a') !== new String('a')` in JS. This is a quirk of JS where strings are ususally compared by reference, not by value. This is why we in some places in the `test()` function we re-initialize the strings with `new String()` to make sure that the strings are compared properly.

There is a trove of information in the game's lua files. By compiling LUA into an AST and then traversing it, we can extract a lot of information about the game. This is underutilized in the dataScripts, but it's a goldmine of information. We should definitely use it more in the future.
