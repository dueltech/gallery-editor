import json5 from 'json5';

export default (config, dev = false) => {
  const configString = json5.stringify(config, null, 2);
  const snippet = `
${dev ? `
<script>
window.DuelVisionService = 'https://vision-dev.duel.me';
window.DuelVisionApi = 'https://api-dev.duel.me';
</script>
<script async src="https://vision-dev.duel.me/loader.js"></script>`
    : '<script async src="https://vision.duel.me/loader.js"></script>'}
<script>
window.DuelVision = window.DuelVision||function(o){(DuelVision.s=DuelVision.s||[]).push(o)};
DuelVision(${configString});
</script>
<div id="duelvision-component"></div>
`;
  return snippet.trim();
};
