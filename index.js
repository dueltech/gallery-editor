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

const init = () => {
  const colorPickers = document.querySelectorAll('.color-picker');
  colorPickers.forEach((picker) => {
    watchColorPicker(picker);
  });
};

init();
