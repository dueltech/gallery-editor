# Duel Gallery Config Editor

This is a simple editor to create or update the configuration for a Duel gallery. The documentation for all the available options can be found at [**/docs**](https://tools.duel.me/gallery-editor/docs).

## Local Development

The only pre-requisite is having Node.js with at least version 10 installed.

### Folder Structure

The source files for the gallery editor can be found at `src/client`. The templates are rendered with Pug for more flexible templating (such as having a different *dev* version available at [**/dev**](https://tools.duel.me/gallery-editor/dev)). The parcel bundler is responsible for bundling the CSS and JS.

The source files for the documentation can be found at `src/docs` and are written in Markdown, the template is written in Pug as well. The rendering is done manually, as the Markdown has to be parsed first.

Any files that are static and just need to be copied over, reside in `src/static`.

### Commands

- `npm start` starts the development server. The client files are reloaded automatically with HMR, the documentation however is not. You need to refresh the browser there manually
- `npm run build` runs a production build of everything
- `npm run deploy` deploys the build folder to github pages, the build command is run automically pre-deploy though
