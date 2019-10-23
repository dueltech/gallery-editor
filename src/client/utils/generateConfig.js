export default () => {
  const config = {};

  // Gallery identifier
  const identifierType = document.getElementById('gallery-identifier').value;
  if (identifierType === 'id') {
    config.id = document.getElementById('id').value;
  } else if (identifierType === 'product') {
    const shortId = document.getElementById('short-id').value;
    const productSku = document.getElementById('product-sku').value;
    config.product = `${shortId}/${productSku}`;
  }

  // Displayed entries
  const displayedEntries = document.getElementById('entries');
  const includeEntryValues = ['topRanked', 'fixed'];
  if (includeEntryValues.includes(displayedEntries.value)) {
    const countInput = document.querySelector('#entries-count input');
    config[displayedEntries.value] = +countInput.value;
  }

  // Include relevant product entries
  const campaignOnly = document.getElementById('campaignOnly');
  if (!campaignOnly.checked) {
    config.campaignOnly = true;
  }

  // Sort order
  const sort = document.getElementById('sort');
  if (sort.value && sort.value !== 'none') {
    config.sort = sort.value;
  }

  // Displayed sort controls
  const sortControls = Array.from(document.querySelectorAll('#sort-controls input'))
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.name);
  if (sortControls.length > 0) {
    config.sortDisplay = sortControls.join(' ');
  }

  // Minimum entries before display
  const displayMin = document.getElementById('displayMin');
  if (displayMin.value) {
    config.displayMin = +displayMin.value;
  }

  // Colors
  const colors = ['color', 'bgColor', 'thumbColor'];
  colors.forEach((color) => {
    const inputEl = document.getElementById(color);
    if (inputEl.value) {
      config[color] = inputEl.value;
    }
  });

  // Misc. display
  const miscDisplayOptions = ['hideAtrributions', 'hideDates', 'testimonialPreview', 'seamless'];
  miscDisplayOptions.forEach((option) => {
    const checkbox = document.getElementById(option);
    if (checkbox.checked) {
      config[option] = true;
    }
  });

  const mapLayoutRules = (tabContent) => {
    const props = ['mediaQuery', 'rows', 'columns'];
    return Array.from(tabContent.childNodes)
      .map((child) => {
        const rule = {};
        props.forEach((prop) => {
          const input = child.querySelector(`.${prop}`);
          if (input && input.value) {
            const { type, value } = input;
            if (prop === 'mediaQuery') {
              rule[prop] = `(${input.value})`;
            } else {
              rule[prop] = type === 'number' ? +value : value;
            }
          }
        });
        return rule;
      })
      .filter(rule => Object.keys(rule).length > 0);
  };

  const getLayoutRules = (style) => {
    const tabContents = document.querySelectorAll('#layout-rules .tab-content > div');
    const getTabContent = layoutStyle => (
      Array.from(tabContents).find(c => layoutStyle === c.dataset.key)
    );
    if (style) {
      return mapLayoutRules(getTabContent(style));
    }
    const allStyles = Array.from(tabContents).map(el => el.dataset.key);
    const rules = {};
    allStyles.forEach((layoutStyle) => {
      const mapped = mapLayoutRules(getTabContent(layoutStyle));
      if (mapped.length > 0) {
        rules[layoutStyle] = mapped;
      }
    });
    return rules;
  };

  // Layout styles
  const layoutStyle = document.getElementById('layoutStyle').value;
  if (!layoutStyle || layoutStyle === 'none') {
    // no configured layout
    return config;
  } if (layoutStyle !== 'dynamic') {
    // layout style is static
    config.layoutStyle = layoutStyle;
    const rows = document.getElementById('default-rows');
    const columns = document.getElementById('default-columns');
    if (rows.value) {
      config.rows = +rows.value;
    }
    if (columns.value) {
      config.columns = +columns.value;
    }
    // layout rules for static style
    const layoutRules = getLayoutRules(layoutStyle);
    if (layoutRules.length > 0) {
      config.layoutRules = {
        [layoutStyle]: layoutRules,
      };
    }
  } else {
    // layout style is dynamic
    const layoutStyles = document.querySelectorAll('#layout-styles > div');
    const layoutStyleRules = Array.from(layoutStyles)
      .map((el) => {
        const styleRule = {};
        const type = el.querySelector('.type').value;
        styleRule.type = type;
        const mediaQuery = el.querySelector('.mediaQuery').value;
        if (mediaQuery) styleRule.mediaQuery = `(${mediaQuery})`;
        return styleRule;
      });
    config.layoutStyle = layoutStyleRules;
    // layout rules for all styles
    const layoutRules = getLayoutRules();
    if (Object.keys(layoutRules).length > 0) {
      config.layoutRules = layoutRules;
    }
  }

  return config;
};
