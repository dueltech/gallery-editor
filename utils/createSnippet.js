import json5 from 'json5';

export default (config) => {
  const configString = json5.stringify(config, null, 2);
  const snippet = `
<script async src="https://vision.duel.me/loader.js"></script>
<script>
window.DuelVision = window.DuelVision||function(o){(DuelVision.s=DuelVision.s||[]).push(o)};
DuelVision(${configString});
</script>
<div id="duelvision-component"></div>
`;
  return snippet.trim();
};
