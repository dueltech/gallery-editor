import createLayoutRule from './components/layoutRule';
import createLayoutStyle from './components/layoutStyle';

const colorRegexShort = /^#([A-Fa-f0-9]{3})$/;
const colorRegex = /^#([A-Fa-f0-9]{6})$/;

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

const watchLayoutSelect = (el) => {
  const inputs = ['rows', 'columns'];
  const updateDisplays = (select) => {
    if (select.selectedOptions) {
      const toShow = select.selectedOptions[0].dataset.show.split(' ');
      inputs.forEach((input) => {
        const inputField = document.getElementById(input);
        inputField.style.display = toShow.includes(input) ? 'flex' : 'none';
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
  updateDisplays(el);
  el.addEventListener('change', ({ target }) => {
    updateDisplays(target);
    checkTabs();
  });
};

const init = () => {
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
};

init();
