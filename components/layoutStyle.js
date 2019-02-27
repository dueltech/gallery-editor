export default ({ type = 'grid', mediaQuery = '' } = {}) => {
  const wrapper = document.createElement('div');
  const selectedString = value => type === value ? 'selected' : '';
  wrapper.className = 'grouped';
  wrapper.innerHTML = `
  <div class="grouped">
    <label>Type</label>
    <div class="select-wrapper">
      <select class="type">
        <option value="grid" ${selectedString('grid')}>Grid</option>
        <option value="list" ${selectedString('list')}>List</option>
        <option value="carousel" ${selectedString('carousel')}>Carousel</option>
      </select>
    </div>
  </div>
  <div class="grouped">
    <label style="width: 7rem">Media query</label>
    <input class="mediaQuery" type="text" placeholder="max-width: 400px" value="${mediaQuery}">
  </div>
  `;
  const buttonRemove = document.createElement('button');
  buttonRemove.innerText = 'Remove';
  buttonRemove.addEventListener('click', ({ target }) => {
    target.parentNode.remove();
  });
  wrapper.appendChild(buttonRemove);
  return wrapper;
};
