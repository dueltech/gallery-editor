const fs = require('fs').promises;
const fsCb = require('fs');
const fsExtra = require('fs-extra');
const Bundler = require('parcel-bundler');
const marked = require('marked');
const hljs = require('highlight.js');
const pug = require('pug');
const express = require('express');
const path = require('path');

marked.setOptions({
  highlight: (code, lang) => hljs.highlight(lang, code).value,
});

const isProd = process.argv.slice(2).includes('--prod');
process.env.NODE_ENV = isProd ? 'production' : 'development';
const outDir = isProd ? 'build' : 'dist';

// parcel config

const entryFiles = 'src/client/*.pug';
const parcelOptions = {
  outDir,
  publicUrl: './',
};

// render docs

let template = pug.compileFile('src/docs/template.pug');

const compileFile = async (file) => {
  const data = await fs.readFile(file, 'utf8');
  const html = template({ content: marked(data) });
  const filename = file.split('/').pop();
  return fs.writeFile(`${outDir}/docs/${filename}`.replace('.md', '.html'), html);
};

const renderDocs = async () => {
  await fsExtra.ensureDir(`./${outDir}/docs`);
  const baseDir = 'src/docs';
  const filenames = await fs.readdir(baseDir);
  const markdownFiles = filenames.filter(filename => filename.endsWith('.md'));
  const compileAll = async () => {
    const compilations = markdownFiles.map(filename => compileFile(`${baseDir}/${filename}`));
    await Promise.all(compilations);
  };
  await compileAll();
  if (!isProd) {
    markdownFiles.forEach((filename) => {
      const file = `${baseDir}/${filename}`;
      fsCb.watch(file, () => {
        compileFile(file);
      });
    });
    fsCb.watch('src/docs/template.pug', () => {
      template = pug.compileFile('src/docs/template.pug');
      compileAll();
    });
  }
};

(async () => {
  await fsExtra.ensureDir(`./${outDir}`);

  // docs rendering
  await renderDocs();

  // common files
  await fsExtra.copy('src/static', outDir);

  // parcel bundling
  const bundler = new Bundler(entryFiles, parcelOptions);
  await bundler.bundle();

  if (!isProd) {
    // serve files
    const app = express();
    app.use(express.static(path.resolve(outDir), { extensions: ['html'] }));
    const port = 1234;
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running at http://localhost:${port}`);
    });
  }
})();
