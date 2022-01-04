# Hadleyville Online

An web version of my rules light Old West RPG, [Hadleyville](https://madinkbeard.itch.io/hadleyville) (free at itch.io).

I have plans to add more features as time permits, see the issues in github.

~~This is coded in Angular because I need to learn it for work, so there might be problems with how I use Angular.~~ Refactored to not use a framework.

This is also me working out the issues with my [RPG Table Randomizer library](https://github.com/derikb/rpg-table-randomizer).

## Install

To use, just point your server at `/dist` or locally, run `npm i && npm run start` to install dependencies and start a dev server that is viewable in your browser.

For development:

- `npm install` to get the dependencies.
- `npm run start` will start the esbuild dev server so you can view in your browser.
- `npm run build` will generate the build files for `/dist` (just js and css).
