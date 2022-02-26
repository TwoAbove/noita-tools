# Noitool

A web app with many things Noita.

Helps you get a specific seed for your specific needs.

Current features include:

* Get seed info
* Search for a seed
* Live seed info viewer

## Technical details and implementation details that I found interesting

The code for finding LC and AP values was transferred from [noita_unicorn](https://github.com/SaphireLattice/noita_unicorn)'s `Program.cs` from c# to c++.

The c++ code is then compiled to wasm and is run in web workers (and partly in the main thread).
The performance improvements are 20-fold by transferring seed functions (like randoms and lc & ap recipes) from a typescript implementation to c++, even with the call overhead from worker -> wasm code.

Also, I took inspiration from [cr4xy](https://cr4xy.dev/noita/) for extra features. You rock! <3

## Development

Prerequsites:

* [emscripten](https://emscripten.org/docs/getting_started/downloads.html) is installed
* `npm i -g google-closure-compiler`
* Node
* Yarn

For emscripten, some edits need to be done to enable the closure compiler:

### emscripten installation and required changes

I recommend using the git repo to install emsdk. Install the latest version.

After, there are a small amount of changes that might need to be done:

* /usr/share/emscripten/tools/building.py

Here, go to line ~888
Verify that this is there:

```py
def get_closure_compiler():
  # First check if the user configured a specific CLOSURE_COMPILER in thier settings
  if config.CLOSURE_COMPILER:
    return config.CLOSURE_COMPILER
```

* ~/.emscripten

Add the closure compiler path to the config.

```py
CLOSURE_COMPILER = ["~/.nvm/versions/node/v16.9.0/bin/google-closure-compiler"]
```

To get the prefix, run:

```sh
npm config get prefix
```

Installation (after emscripten): `yarn`

Running: `yarn dev`
