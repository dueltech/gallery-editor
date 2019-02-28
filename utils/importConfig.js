import createLayoutRule from '../components/layoutRule';
import createLayoutStyle from '../components/layoutStyle';

export default (config) => {
  // Displayed entries
  const entryValues = ['topRanked', 'fixed'];
  const entryValue = Object.keys(config).find(key => entryValues.includes(key));
  document.getElementById('entries').value = entryValue || 'none';
  if (entryValue) {
    const countInput = document.querySelector('#entries-count input');
    countInput.value = config[entryValue];
  }

  // Include relevant product entries
  document.getElementById('campaignOnly').checked = !config.campaignOnly;

  // Sort order
  document.getElementById('sort').value = config.sort || 'none';

  // Displayed sort controls
  const split = config.sortDisplay ? config.sortDisplay.split(' ') : [];
  const sortControls = document.querySelectorAll('#sort-controls input');
  sortControls.forEach((checkbox) => {
    checkbox.checked = split.includes(checkbox.name);
  });

  // Minimum entries before display
  document.getElementById('displayMin').value = config.displayMin || '';

  // Colors
  const colors = ['color', 'bgColor', 'thumbColor'];
  colors.forEach((color) => {
    document.getElementById(color).value = config[color] || '';
  });

  // Misc. display
  const miscDisplayOptions = ['hideAtrributions', 'hideDates', 'testimonialPreview', 'seamless'];
  miscDisplayOptions.forEach((option) => {
    document.getElementById(option).checked = config[option];
  });

  // Reset layout styles & rules
  document.getElementById('layout-styles').innerHTML = '';
  const tabs = document.querySelectorAll('#layout-rules .tab-content > div');
  tabs.forEach((tab) => {
    tab.innerHTML = '';
  });

  // Layout styles
  const layoutStyleValue = Array.isArray(config.layoutStyle) ? 'dynamic' : config.layoutStyle;
  document.getElementById('layoutStyle').value = layoutStyleValue || 'none';
  document.getElementById('default-rows').value = config.rows || '';
  document.getElementById('default-columns').value = config.columns || '';
  if (layoutStyleValue === 'dynamic') {
    const wrapper = document.getElementById('layout-styles');
    config.layoutStyle.forEach((style) => {
      wrapper.appendChild(createLayoutStyle(style));
    });
  }

  // Layout rules
  if (config.layoutRules) {
    Object.entries(config.layoutRules).forEach(([style, rules]) => {
      rules.forEach((ruleSet) => {
        const tab = Array.from(tabs).find(el => el.dataset.key === style);
        if (tab) {
          tab.appendChild(createLayoutRule(style, ruleSet));
        }
      });
    });
  }
};
