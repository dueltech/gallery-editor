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
  const createFile = () => fs.writeFile(`build/docs/${filename}`.replace('.md', '.html'), html);
  try {
    await createFile();
  } catch (error) {
    await fs.mkdir('build/docs', { recursive: true });
    await createFile();
  }
};

const watchMode = process.argv.slice(2).includes('--watch');

const addGithubCss = () => (
  fs.copyFile('src/docs/github-hljs.css', 'build/docs/github-hljs.css')
);

(async () => {
  const baseDir = 'src/docs';
  const filenames = await fs.readdir(baseDir);
  const markdownFiles = filenames.filter(filename => filename.endsWith('.md'));
  const compileAll = async () => {
    const compilations = markdownFiles.map(filename => compileFile(`${baseDir}/${filename}`));
    await Promise.all(compilations);
  };
  await compileAll();
  await addGithubCss();
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
