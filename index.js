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
  // display rows/columns inputs based on selected value for "Layout Style"
  watchLayoutSelect(document.getElementById('layoutStyle'));
  // add layout style rule on click
  document.getElementById('new-layout-style').addEventListener('click', () => {
    document.getElementById('layout-styles').appendChild(createLayoutStyle());
  });
};

init();
