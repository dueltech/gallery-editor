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

const init = () => {
  // watch for color picker changes
  const colorPickers = document.querySelectorAll('.color-picker');
  colorPickers.forEach((picker) => {
    watchColorPicker(picker);
  });
  // display count input based on selected value for "Displayed Entries"
  watchEntriesSelect(document.getElementById('entries'));
};

init();
