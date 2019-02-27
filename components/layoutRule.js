export default (style, { mediaQuery = '', rows = '', columns = '' } = {}) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'grouped';
  wrapper.innerHTML = `
  <div class="grouped">
    <label>Media query</label>
    <input type="text" placeholder="max-width: 400px" value="${mediaQuery}">
  </div>
  ${style !== 'carousel' ? `
  <div class="grouped">
    <label>Rows</label>
    <input type="number" placeholder="auto" value="${rows}">
  </div>
  ` : ''}
  ${style !== 'list' ? `
  <div class="grouped">
    <label>Columns</label>
    <input type="number" placeholder="auto" value="${columns}">
  </div>
  ` : ''}
  `;
  const buttonRemove = document.createElement('button');
  buttonRemove.innerText = 'Remove';
  buttonRemove.addEventListener('click', ({ target }) => {
    target.parentNode.remove();
  });
  wrapper.appendChild(buttonRemove);
  return wrapper;
};
