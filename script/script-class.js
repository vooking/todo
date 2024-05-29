class TodoItem {
    constructor(text, completed = false) {
        this.text = text;
        this.completed = completed;
        this.element = this.createElement();
    }

    createElement() {
        var li = document.createElement('li');
        li.innerHTML = `
            <p>${this.text}</p>
            <div>
                ${this.completed ? '' : '<button id="complete"><img src="./svg/check.svg" alt="Завершить" width="16" height="16"></button>'}
                ${this.completed ? '' : '<button id="delete"><img src="./svg/delete.svg" alt="Удалить" width="16" height="16"></button>'}
            </div>
        `;
        return li;
    }
}

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

    createItem(item) {
        return new TodoItem(item.text, item.completed).element;
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
        this.completed.forEach(item => this.done.appendChild(this.createItem(item)));

        this.updateCount();
    }

    bindEvents() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        document.addEventListener('click', this.handleClick.bind(this));
    }
    
    handleSubmit(e) {
        e.preventDefault();
        const input = this.form.querySelector('#item');
        if (!input.value.trim()) return;
    
        const item = { text: input.value, completed: false };
        this.items.push(item);
        this.updateStorage();
        this.todo.appendChild(this.createItem(item));
    
        input.value = '';
        this.updateCount();
    }
    
    handleClick(e) {
        if (e.target.closest('button')?.id !== 'delete' && e.target.closest('button')?.id !== 'complete') return;
    
        const li = e.target.closest('li');
        const index = this.items.findIndex(item => item.text === li.querySelector('p').textContent);
        const item = this.items[index];
        this.items.splice(index, 1);
    
        if (e.target.closest('div').closest('ul') === this.done) {
            const indexDone = this.completed.findIndex(item => item.text === li.querySelector('p').textContent);
            this.completed.splice(indexDone, 1);
        }
    
        if (e.target.id === 'complete') {
            item.completed = true;
            this.completed.push(item);
            this.done.appendChild(this.createItem(item));
            this.updateStorage();
        }
    
        li.remove();
        this.updateStorage();
        this.updateCount();
    }
    
}

new TodoApp();
