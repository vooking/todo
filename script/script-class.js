class TodoItem {
    constructor(id, text, completed = false) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        this.element = this.createElement();
    }

    createElement() {
        const buttons = !this.completed ? [
            this.createButton('complete', 'check', 'Завершить'),
            this.createButton('delete', 'delete', 'Удалить')
        ].join('') : '';

        const li = document.createElement('li');
        li.dataset.id = this.id;
        li.className = this.completed ? 'completed' : '';
        li.innerHTML = `<p>${this.text}</p><div>${buttons}</div>`;

        return li;
    }

    createButton(id, imgSrc, altText) {
        return `<button id="${id}"><img src="./svg/${imgSrc}.svg" alt="${altText}" width="16" height="16"></button>`;
    }
}

class StorageManager {
    static getItems(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    static setItems(key, items) {
        localStorage.setItem(key, JSON.stringify(items));
    }
}

class TodoApp {
    constructor() {
        this.form = document.querySelector('form');
        this.todo = document.querySelector('#items');
        this.done = document.querySelector('#completed');
        this.countTodo = document.querySelector('#countTodo');
        this.countDone = document.querySelector('#countDone');
        this.items = StorageManager.getItems('items');

        this.bindEvents();
        this.renderItems();
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
        this.updateStorageAndRender();

        input.value = '';
    }

    handleClick(e) {
        const button = e.target.closest('button');
        if (!button) return;

        const li = button.closest('li');
        if (!li) return;

        const id = Number(li.dataset.id);

        if (button.id === 'delete') {
            this.items = this.items.filter(item => item.id !== id);
        } else if (button.id === 'complete') {
            const item = this.items.find(item => item.id === id);
            if (item) {
                item.completed = true;
            }
        }

        this.updateStorageAndRender();
    }

    renderItems() {
        this.todo.innerHTML = '';
        this.done.innerHTML = '';

        const todoItems = this.items.filter(item => !item.completed);
        const completedItems = this.items.filter(item => item.completed);

        todoItems.forEach(item => this.todo.appendChild(new TodoItem(item.id, item.text, item.completed).element));
        completedItems.forEach(item => this.done.appendChild(new TodoItem(item.id, item.text, item.completed).element));

        this.updateCount(todoItems.length, completedItems.length);
    }

    updateCount(todoCount, doneCount) {
        this.countTodo.textContent = todoCount;
        this.countDone.textContent = doneCount;
    }

    updateStorageAndRender() {
        StorageManager.setItems('items', this.items);
        this.renderItems();
    }
}

document.addEventListener('DOMContentLoaded', () => new TodoApp());
