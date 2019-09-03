const fs = require('fs').promises;
const fsCb = require('fs');
const marked = require('marked');
const hljs = require('highlight.js');
const pug = require('pug');

marked.setOptions({
  highlight: (code, lang) => hljs.highlight(lang, code).value,
});

let template = pug.compileFile('src/docs/template.pug');

const compileFile = async (file) => {
  const data = await fs.readFile(file, 'utf8');
  const html = template({ content: marked(data) });
  const filename = file.split('/').pop();
  return fs.writeFile(`docs/docs/${filename}`.replace('.md', '.html'), html);
};

const watchMode = process.argv.slice(2).includes('--watch');

(async () => {
  const baseDir = 'src/docs';
  const filenames = await fs.readdir(baseDir);
  const markdownFiles = filenames.filter(filename => filename.endsWith('.md'));
  const compileAll = async () => {
    const compilations = markdownFiles.map(filename => compileFile(`${baseDir}/${filename}`));
    await Promise.all(compilations);
  };
  await compileAll();
  if (watchMode) {
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
})();
