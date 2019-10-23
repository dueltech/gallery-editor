const colorRegexShort = /^#([A-Fa-f0-9]{3})$/;
const colorRegex = /^#([A-Fa-f0-9]{6})$/;

export default (color, defaultColor = '#ffffff') => {
  if (color.match(colorRegex)) {
    return color;
  } if (color.match(colorRegexShort)) {
    const transformed = Array.from(color.slice(1))
      .map(char => char + char)
      .join('');
    return `#${transformed}`;
  }
  return defaultColor;
};
