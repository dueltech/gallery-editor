import json5 from 'json5';
import createLayoutRule from './components/layoutRule';
import createLayoutStyle from './components/layoutStyle';
import generateConfig from './utils/generateConfig';
import importConfig from './utils/importConfig';
import createSnippet from './utils/createSnippet';
import transformHexColor from './utils/transformHexColor';

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
    el.classList.toggle('hidden', toShow !== id);
  });
};

const watchColorPicker = (el) => {
  const textField = el.querySelector('input:not([type="color"])');
  const colorField = el.querySelector('input[type="color"]');
  textField.addEventListener('input', ({ target }) => {
    colorField.value = transformHexColor(target.value);
  });
  colorField.addEventListener('input', ({ target }) => {
    textField.value = target.value;
  });
  if (textField.value) {
    colorField.value = textField.value; // text field could have a default value
  }
};

const watchEntriesSelect = (el) => {
  const showCountFor = ['topRanked', 'fixed'];
  const countInput = document.getElementById('entries-count');
  const updateDisplay = (select) => {
    countInput.classList.toggle('hidden', !showCountFor.includes(select.value));
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
    layoutRules.classList.add('hidden');
  } else if (layoutStyle.value !== 'dynamic') {
    layoutRules.classList.remove('hidden');
    tabsContainer.classList.add('hidden');
    tabContents.forEach((c) => { c.classList.remove('active'); });
    const tabContent = Array.from(tabContents).find(c => layoutStyle.value === c.dataset.key);
    tabContent.classList.add('active');
  } else {
    layoutRules.classList.remove('hidden');
    tabsContainer.classList.remove('hidden');
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
      inputWrapper.classList.toggle('hidden', !toShow.includes(input));
      if (onChange) {
        inputWrapper.querySelector('input').value = '';
      }
    });
    // display layout style rules based on layout style selection
    const layoutStyles = document.getElementById('layout-styles');
    if (select.selectedOptions[0].value === 'dynamic') {
      layoutStyles.parentNode.classList.remove('hidden');
      if (layoutStyles.innerHTML === '') {
        // insert example rule if empty
        layoutStyles.appendChild(createLayoutStyle());
      }
    } else {
      layoutStyles.parentNode.classList.add('hidden');
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
  const configContainer = document.getElementById('config-code');
  if (language === 'html') {
    configContainer.value = createSnippet(config, window.DUEL_DEV_LOADER);
  } else if (language === 'js') {
    configContainer.value = json5.stringify(config, null, 2);
  } else {
    configContainer.value = JSON.stringify(config, null, 2);
  }
};

const showPreview = () => {
  // reset currently previewed gallery
  const galleryDiv = document.getElementById('duelvision-component');
  galleryDiv.innerHTML = '';
  // display loader while (re-)loading the gallery
  const loader = document.querySelector('#gallery-container .loader');
  loader.classList.toggle('hidden', false);
  const config = generateConfig();
  if (!config.id && !config.product) {
    // example gallery
    config.id = window.DUEL_DEV_LOADER ? '5a37ad3e71fd32000475a9d0' : '5cc9da7bf0b9d2002d136acb';
  }
  // eslint-disable-next-line no-undef
  DuelVision.load(config);

  // the widget sends a 'ready' message once it's loaded
  // example data of a message looks as follows:
  // duelvision:{"ready":true,"name":"duelvision-0"}
  window.addEventListener('message', ({ data }) => {
    const marker = /^duelvision:/;
    if (!((typeof data === 'string') && marker.test(data))) {
      return;
    }
    try {
      const dataParsed = JSON.parse(data.replace(marker, ''));
      if (dataParsed.ready) {
        loader.classList.toggle('hidden', true);
      }
    } catch (error) {
      console.error('Failed to parse JSON data for message', data);
    }
  });
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
  // show/update preview of gallery on click
  const buttonIds = ['show-preview', 'refresh-preview'];
  buttonIds.forEach((buttonId) => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', showPreview);
    }
  });
};

init();
