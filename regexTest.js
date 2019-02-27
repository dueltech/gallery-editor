const string = `
{
  "sort": "rank",
  "sortDisplay": "rank created",
  "displayMin": 5,
  "bgColor": "#333",
  "thumbColor": "#6acc40",
  "hideDates": true,
  "seamless": true,
  "layoutStyle": "carousel",
  "rows": 7,
  "columns": 4,
  "layoutRules": {
    "carousel": [
      {
        "mediaQuery": "(max-width: 800px)",
        "columns": 3
      }
    ]
  }
}
`;

const modified = string
  .replace(/^\s+"/gm, x => x.replace('"', ''))
  .replace(/":/g, x => x.replace('"', ''))
  .replace(/"/g, "'");
console.log(modified);
