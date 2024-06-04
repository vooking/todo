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
    constructor(id, text, completed = false) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        this.element = this.createElement();
    }

    createElement() {
        const buttons = !this.completed ? [
            new Button('complete', 'check', 'Завершить').createElement(),
            new Button('delete', 'delete', 'Удалить').createElement()
        ].join('') : '';
        
        const li = document.createElement('li');
        li.dataset.id = this.id;
        li.className = this.completed ? 'completed' : '';
        li.innerHTML = `<p>${this.text}</p><div>${buttons}</div>`;
        
        return li;
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

class Renderer {
    constructor(todoElement, doneElement, countTodoElement, countDoneElement) {
        this.todoElement = todoElement;
        this.doneElement = doneElement;
        this.countTodoElement = countTodoElement;
        this.countDoneElement = countDoneElement;
    }

    renderItems(items, completed) {
        this.todoElement.innerHTML = '';
        this.doneElement.innerHTML = '';
        
        items.forEach(item => this.todoElement.appendChild(new TodoItem(item.id, item.text, item.completed).element));
        completed.forEach(item => this.doneElement.appendChild(new TodoItem(item.id, item.text, item.completed).element));
        
        this.updateCount(items.length, completed.length);
    }

    updateCount(todoCount, doneCount) {
        this.countTodoElement.textContent = todoCount;
        this.countDoneElement.textContent = doneCount;
    }
}

class EventHandler {
    constructor(todoApp) {
        this.todoApp = todoApp;
    }

    bindEvents() {
        this.todoApp.form.addEventListener('submit', this.handleSubmit.bind(this));
        document.addEventListener('click', this.handleClick.bind(this));
    }

    handleSubmit(e) {
        e.preventDefault();
        const input = this.todoApp.form.querySelector('#item');
        if (!input.value.trim()) return;

        const item = { id: Date.now(), text: input.value, completed: false };
        this.todoApp.items.push(item);
        this.updateStorageAndRender();

        input.value = '';
    }

    handleClick(e) {
        const button = e.target.closest('button');
        if (!button) return;

        const li = button.closest('li');
        const id = Number(li.dataset.id);

        if (button.id === 'delete') {
            this.todoApp.items = this.todoApp.items.filter(item => item.id !== id);
            this.todoApp.completed = this.todoApp.completed.filter(item => item.id !== id);
        } else if (button.id === 'complete') {
            const item = this.todoApp.items.find(item => item.id === id);
            if (item) {
                this.todoApp.items = this.todoApp.items.filter(item => item.id !== id);
                item.completed = true;
                this.todoApp.completed.push(item);
            }
        }

        this.updateStorageAndRender();
    }

    updateStorageAndRender() {
        StorageManager.setItems('items', this.todoApp.items);
        StorageManager.setItems('completed', this.todoApp.completed);
        this.todoApp.renderer.renderItems(this.todoApp.items, this.todoApp.completed);
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
        this.completed = StorageManager.getItems('completed');
        this.renderer = new Renderer(this.todo, this.done, this.countTodo, this.countDone);
        this.eventHandler = new EventHandler(this);
        this.eventHandler.bindEvents();
        this.renderer.renderItems(this.items, this.completed);
    }
}

document.addEventListener('DOMContentLoaded', () => new TodoApp());
