class TodoApp {
    constructor() {
        this.form = document.querySelector('form');
        this.todo = document.querySelector('#items');
        this.done = document.querySelector('#completed');
        this.countTodo = document.querySelector('#countTodo');
        this.countDone = document.querySelector('#countDone');
        this.items = JSON.parse(localStorage.getItem('items')) || [];
        this.completed = JSON.parse(localStorage.getItem('completed')) || [];
        this.bindEvents();
        this.renderItems();
    }

    createItem(text, completed = false) {
        var li = document.createElement('li');
        li.innerHTML = `
            <p>${text}</p>
            <div>
                ${completed ? '' : '<button id="complete"><img src="./svg/check.svg" alt="Завершить" width="16" height="16"></button>'}
                ${completed ? '' : '<button id="delete"><img src="./svg/delete.svg" alt="Удалить" width="16" height="16"></button>'}
            </div>
        `;
        return li;
    }

    updateCount() {
        this.countTodo.textContent = this.todo.getElementsByTagName('li').length;
        this.countDone.textContent = this.done.getElementsByTagName('li').length;
    }

    updateStorage() {
        localStorage.setItem('items', JSON.stringify(this.items));
        localStorage.setItem('completed', JSON.stringify(this.completed));
    }

    renderItems() {
        this.todo.innerHTML = '';
        this.done.innerHTML = '';
        this.items.forEach(item => this.todo.appendChild(this.createItem(item)));
        this.completed.forEach(item => this.done.appendChild(this.createItem(item, true)));
        this.updateCount();
    }

    bindEvents() {
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            const input = this.form.querySelector('#item');
            if (!input.value) return;
            this.items.push(input.value);
            this.updateStorage();
            this.todo.appendChild(this.createItem(input.value));
            input.value = '';
            this.updateCount();
        });

        document.addEventListener('click', e => {
            if (e.target.closest('button')?.id !== 'delete' && e.target.closest('button')?.id !== 'complete') return;
            const li = e.target.closest('li');
            const index = this.items.indexOf(li.querySelector('p').textContent);
            this.items.splice(index, 1);
            if (e.target.closest('div').closest('ul') === this.done) {
                const indexDone = this.completed.indexOf(li.querySelector('p').textContent);
                this.completed.splice(indexDone, 1);
            }
            if (e.target.id === 'complete') {
                this.completed.push(li.querySelector('p').textContent);
                this.done.appendChild(this.createItem(li.querySelector('p').textContent, true));
                this.updateStorage();
            }
            li.remove();
            this.updateStorage();
            this.updateCount();
        });
    }
}

new TodoApp();
