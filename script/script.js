const form = document.querySelector('form');
const todo = document.querySelector('#items');
const done = document.querySelector('#completed');
const countTodo = document.querySelector('#countTodo');
const countDone = document.querySelector('#countDone');
const items = JSON.parse(localStorage.getItem('items')) || [];
const completed = JSON.parse(localStorage.getItem('completed')) || [];

function createItem(text, completed = false) {
  var li = document.createElement('li');
    if (!li) {
        countDone.textContent = parseInt(countDone.textContent) + 1;
    }
  li.innerHTML = `
      <p>${text}</p>
      <div>
          ${completed ? '' : '<button id="complete"><img src="./svg/check.svg" alt="Завершить" width="16" height="16"></button>'}
          ${completed ? '' : '<button id="delete"><img src="./svg/delete.svg" alt="Удалить" width="16" height="16"></button>'}
      </div>
  `;
  return li;
}


function updateCount() {
    countTodo.textContent = todo.getElementsByTagName('li').length;
    countDone.textContent = done.getElementsByTagName('li').length;
}

function updateStorage() {
    localStorage.setItem('items', JSON.stringify(items));
    localStorage.setItem('completed', JSON.stringify(completed));
}

function renderItems() {
    todo.innerHTML = '';
    done.innerHTML = '';
    items.forEach(item => todo.appendChild(createItem(item)));
    completed.forEach(item => done.appendChild(createItem(item, true)));
    updateCount();
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('#item');
    if (!input.value) return;
    items.push(input.value);
    updateStorage();
    todo.appendChild(createItem(input.value));
    input.value = '';
    updateCount();
});

document.addEventListener('click', e => {
  if (e.target.closest('button')?.id !== 'delete' && e.target.closest('button')?.id !== 'complete') return;
  const li = e.target.closest('li');
  const index = items.indexOf(li.querySelector('p').textContent);
  items.splice(index, 1);
  if (e.target.closest('div').closest('ul') === done) {
      const indexDone = completed.indexOf(li.querySelector('p').textContent);
      completed.splice(indexDone, 1);
  }
  if (e.target.id === 'complete') {
      completed.push(li.querySelector('p').textContent);
      done.appendChild(createItem(li.querySelector('p').textContent, true));
  }
  li.remove();
  updateStorage();
  updateCount();
});


renderItems();
