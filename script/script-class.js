class Button {
    constructor(id, imgSrc, altText) {
        this.id = id;
        this.imgSrc = imgSrc;
        this.altText = altText;
    }

    createElement() {
        return `<button id="${this.id}"><img src="./svg/${this.imgSrc}.svg" alt="${this.altText}" width="16" height="16"></button>`;
    }
}

class TodoItem {
    constructor(id, text, completed = false, buttons = []) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        this.buttons = buttons;
        this.element = this.createElement();
    }

    createElement() {
        const buttonsHTML = this.buttons.map(button => button.createElement()).join('');
        const li = document.createElement('li');
        li.innerHTML = `
            <p>${this.text}</p>
            <div>
                ${buttonsHTML}
            </div>
        `;
        li.setAttribute('data-id', this.id);
        if (this.completed) {
            li.classList.add('completed');
        }
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
        const buttons = item.completed ? 
            [] : 
            [new Button('complete', 'check', 'Завершить'), new Button('delete', 'delete', 'Удалить')];
        return new TodoItem(item.id, item.text, item.completed, buttons).element;
    }

    updateCount() {
        this.countTodo.textContent = this.items.length;
        this.countDone.textContent = this.completed.length;
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

        const item = { id: Date.now(), text: input.value, completed: false };
        this.items.push(item);
        this.updateStorage();
        this.todo.appendChild(this.createItem(item));

        input.value = '';
        this.updateCount();
    }

    handleClick(e) {
        const button = e.target.closest('button');
        if (!button) return;

        const li = button.closest('li');
        const id = Number(li.dataset.id);

        if (button.id === 'delete') {
            this.deleteItem(id, li);
        } else if (button.id === 'complete') {
            this.completeItem(id, li);
        }
    }

    deleteItem(id, li) {
        this.items = this.items.filter(item => item.id !== id);
        this.completed = this.completed.filter(item => item.id !== id);

        li.remove();
        this.updateStorage();
        this.updateCount();
    }

    completeItem(id, li) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            this.items = this.items.filter(item => item.id !== id);
            item.completed = true;
            this.completed.push(item);
        }

        li.remove();
        this.updateStorage();
        this.renderItems();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
