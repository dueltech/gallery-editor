import json5 from 'json5';
import createLayoutRule from './components/layoutRule';
import createLayoutStyle from './components/layoutStyle';
import generateConfig from './utils/generateConfig';
import importConfig from './utils/importConfig';
import createSnippet from './utils/createSnippet';

const colorRegexShort = /^#([A-Fa-f0-9]{3})$/;
const colorRegex = /^#([A-Fa-f0-9]{6})$/;

const updateGalleryIdControls = () => {
  const select = document.getElementById('gallery-identifier');
  const showable = Array.from(select.children)
    .map(el => el.dataset.show)
    .filter(id => id);
  const toShow = select.selectedOptions && select.selectedOptions.length > 0
    ? select.selectedOptions[0].dataset.show
    : '';
  showable.forEach((id) => {
    const el = document.getElementById(id);
    if (toShow === id) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
};

const watchColorPicker = (el) => {
  const textField = el.querySelector('input:not([type="color"])');
  const colorField = el.querySelector('input[type="color"]');
  textField.addEventListener('input', ({ target }) => {
    if (target.value.match(colorRegex)) {
      colorField.value = target.value;
    } else if (target.value.match(colorRegexShort)) {
      const transformed = Array.from(target.value.slice(1))
        .map(char => char + char)
        .join('');
      colorField.value = `#${transformed}`;
    }
  });
  colorField.addEventListener('input', ({ target }) => {
    textField.value = target.value;
  });
};

const watchEntriesSelect = (el) => {
  const showCountFor = ['topRanked', 'fixed'];
  const countInput = document.getElementById('entries-count');
  const updateDisplay = (select) => {
    countInput.style.display = showCountFor.includes(select.value) ? 'flex' : 'none';
  };
  updateDisplay(countInput);
  el.addEventListener('change', ({ target }) => {
    updateDisplay(target);
  });
};

const checkTabs = () => {
  const layoutStyle = document.getElementById('layoutStyle');
  const layoutRules = document.getElementById('layout-rules');
  const tabsContainer = layoutRules.querySelector('.tabs');
  const tabContents = layoutRules.querySelectorAll('.tab-content > div');
  if (!layoutStyle || layoutStyle.value === 'none') {
    layoutRules.style.display = 'none';
  } else if (layoutStyle.value !== 'dynamic') {
    layoutRules.style.display = 'block';
    tabsContainer.style.display = 'none';
    tabContents.forEach((c) => { c.classList.remove('active'); });
    const tabContent = Array.from(tabContents).find(c => layoutStyle.value === c.dataset.key);
    tabContent.classList.add('active');
  } else {
    layoutRules.style.display = 'block';
    tabsContainer.style.display = 'flex';
  }
};

const watchTabNavigation = () => {
  const tabButtons = document.querySelectorAll('#layout-rules .tabs > span');
  const tabContents = document.querySelectorAll('#layout-rules .tab-content > div');
  tabButtons.forEach((tabButton) => {
    tabButton.addEventListener('click', () => {
      // remove "active" class from all tab buttons and contents
      tabButtons.forEach((b) => { b.classList.remove('active'); });
      tabContents.forEach((c) => { c.classList.remove('active'); });
      tabButton.classList.add('active');
      const tabContent = Array.from(tabContents).find(c => tabButton.dataset.key === c.dataset.key);
      tabContent.classList.add('active');
    });
  });
};

const updateLayoutDisplays = (select, onChange = false) => {
  const inputs = ['rows', 'columns'];
  if (select.selectedOptions) {
    const toShow = select.selectedOptions[0].dataset.show.split(' ');
    inputs.forEach((input) => {
      const inputWrapper = document.getElementById(input);
      inputWrapper.style.display = toShow.includes(input) ? 'flex' : 'none';
      if (onChange) {
        inputWrapper.querySelector('input').value = '';
      }
    });
    // display layout style rules based on layout style selection
    const layoutStyles = document.getElementById('layout-styles');
    if (select.selectedOptions[0].value === 'dynamic') {
      layoutStyles.parentNode.style.display = 'block';
      if (layoutStyles.innerHTML === '') {
        // insert example rule if empty
        layoutStyles.appendChild(createLayoutStyle());
      }
    } else {
      layoutStyles.parentNode.style.display = 'none';
    }
  }
};

const watchLayoutSelect = (el) => {
  updateLayoutDisplays(el);
  el.addEventListener('input', ({ target }) => {
    updateLayoutDisplays(target, true);
    checkTabs();
  });
};

const addImportListeners = () => {
  const importModal = document.getElementById('import-modal');
  document.getElementById('import-config').addEventListener('click', () => {
    importModal.style.display = 'block';
  });
  document.querySelectorAll('.modal .close').forEach((closeButton) => {
    closeButton.addEventListener('click', () => {
      importModal.style.display = 'none';
    });
  });
  importModal.addEventListener('click', ({ target }) => {
    if (target === importModal) {
      importModal.style.display = 'none';
    }
  });
  document.querySelector('#import-modal button').addEventListener('click', () => {
    const configString = document.querySelector('#import-modal textarea').value;
    const errorContainer = document.querySelector('#import-modal .error');
    try {
      const config = json5.parse(configString);
      errorContainer.style.display = 'none';
      errorContainer.innerText = '';
      importConfig(config);
      updateGalleryIdControls();
      updateLayoutDisplays(document.getElementById('layoutStyle'));
      checkTabs();
      importModal.style.display = 'none';
    } catch (error) {
      errorContainer.style.display = 'block';
      errorContainer.innerText = `Error: ${error.message}`;
      console.error(error);
    }
  });
};

const updateConfig = () => {
  const language = Array.from(document.getElementsByName('language'))
    .find(el => el.checked)
    .value;
  const config = generateConfig();
  if (language === 'html') {
    document.getElementById('config-code').value = createSnippet(config);
  } else {
    document.getElementById('config-code').value = JSON.stringify(config, null, 2);
  }
};

const init = () => {
  // add import functionality
  addImportListeners();
  // watch for changes to gallery identifier inputs
  updateGalleryIdControls();
  document.getElementById('gallery-identifier').addEventListener('input', updateGalleryIdControls);
  // watch for color picker changes
  const colorPickers = document.querySelectorAll('.color-picker');
  colorPickers.forEach((picker) => {
    watchColorPicker(picker);
  });
  // display count input based on selected value for "Displayed Entries"
  watchEntriesSelect(document.getElementById('entries'));
  // add layout style on click
  document.getElementById('new-layout-style').addEventListener('click', () => {
    document.getElementById('layout-styles').appendChild(createLayoutStyle());
  });
  // tab navigation
  checkTabs();
  watchTabNavigation();
  // add layout rule on click
  document.getElementById('new-layout-rule').addEventListener('click', () => {
    const activeTab = document.querySelector('.tab-content .active');
    activeTab.appendChild(createLayoutRule(activeTab.dataset.key));
  });
  // display rows/columns inputs based on selected value for "Layout Style"
  watchLayoutSelect(document.getElementById('layoutStyle'));
  // generate config code on click and update on language change
  document.getElementById('generate-config').addEventListener('click', updateConfig);
  Array.from(document.getElementsByName('language')).forEach((radioButton) => {
    radioButton.addEventListener('change', updateConfig);
  });
};

init();
