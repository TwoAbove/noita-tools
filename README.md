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
