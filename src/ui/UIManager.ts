import { Todo } from '../types/types';
import { TodoService } from '../services/TodoService';
import { ClockService } from '../services/ClockService';


export class UIManager {
  private todoService: TodoService;
  private todoList!: HTMLUListElement;
  private todoInput!: HTMLInputElement;
  private todoForm!: HTMLFormElement;
  private dueDateInput!: HTMLInputElement;
  private prioritySelect!: HTMLSelectElement;
  private progressBar!: HTMLDivElement;

  constructor() {
    this.todoService = TodoService.getInstance();
    this.initializeElements();
    this.setupEventListeners();
    this.initializeDarkMode(); // Ensure dark mode setting is applied on load
    this.render();
  }

  private initializeElements(): void {
    this.todoList = document.getElementById('todo-list') as HTMLUListElement;
    this.todoInput = document.getElementById('todo-input') as HTMLInputElement;
    this.todoForm = document.querySelector('.todo-form') as HTMLFormElement;
    this.dueDateInput = document.getElementById('due-date') as HTMLInputElement;
    this.prioritySelect = document.getElementById('priority') as HTMLSelectElement;
    this.progressBar = document.getElementById('progress-bar') as HTMLDivElement;
  }

  private setupEventListeners(): void {
    // Form submission
    this.todoForm.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.handleAddTodo();
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle?.addEventListener('click', () => this.toggleDarkMode());

    // Toggle all
    const toggleAllBtn = document.getElementById('toggle-all-btn');
    toggleAllBtn?.addEventListener('click', () => {
      this.todoService.toggleAll();
      this.render();
    });

    // Clear completed
    const clearCompletedBtn = document.getElementById('clear-completed-btn');
    clearCompletedBtn?.addEventListener('click', () => {
      this.todoService.clearCompleted();
      this.render();
    });
  }

  private handleAddTodo(): void {
    const text = this.todoInput.value.trim();
    const dueDate = this.dueDateInput.value;
    const priority = this.prioritySelect.value as 'Low' | 'Medium' | 'High';

    if (text) {
      this.todoService.addTodo(text, dueDate, priority);
      this.todoInput.value = '';
      this.dueDateInput.value = '';
      this.prioritySelect.value = 'Low';
      this.render();
    }
  }

  private createTodoElement(todo: Todo): HTMLLIElement {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const content = document.createElement('div');
    content.className = `todo-content ${todo.completed ? 'completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;

    if (todo.dueDate) {
      const dueDateSpan = document.createElement('span');
      dueDateSpan.className = 'due-date';
      dueDateSpan.textContent = `Due: ${todo.dueDate}`;
      content.appendChild(dueDateSpan);
    }

    const priorityBadge = document.createElement('span');
    priorityBadge.className = `priority-badge priority-${todo.priority.toLowerCase()}`;
    priorityBadge.textContent = todo.priority;

    // Add event listeners
    checkbox.addEventListener('change', () => {
      this.todoService.toggleTodo(todo.id);
      this.render();
    });

    // Append elements to the content
    content.append(checkbox, textSpan, priorityBadge);
    li.append(content, this.createActions(todo));

    return li;
  }

  private createActions(todo: Todo): HTMLDivElement {
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'todo-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      const newText = prompt('Edit todo:', todo.text);
      if (newText) {
        this.todoService.editTodo(todo.id, newText);
        this.render();
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      this.todoService.deleteTodo(todo.id);
      this.render();
    });

    actionsDiv.append(editBtn, deleteBtn);
    return actionsDiv;
  }

  private updateProgressBar(): void {
    const todos = this.todoService.getTodos();
    const completedCount = todos.filter(todo => todo.completed).length;
    const progress = todos.length ? (completedCount / todos.length) * 100 : 0;

    this.progressBar.style.width = `${progress}%`;
    this.progressBar.textContent = `${completedCount}/${todos.length} completed`;
  }

  private toggleDarkMode(): void {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode').toString());
  }

  private initializeDarkMode(): void {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (darkModeEnabled) document.body.classList.add('dark-mode');
  }

  render(): void {
    const todos = this.todoService.getTodos();
    this.todoList.innerHTML = '';

    if (todos.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-list-message';
      emptyMessage.textContent = 'No todos available. Add a new one!';
      this.todoList.appendChild(emptyMessage);
    } else {
      todos.forEach(todo => {
        this.todoList.appendChild(this.createTodoElement(todo));
      });
    }

    this.updateProgressBar();

  }

}
const clockService = ClockService.getInstance();

// Function to update the clock element in the DOM
function updateClockDisplay() {
  const clockElement = document.getElementById('clock');
  if (clockElement) {
    clockElement.textContent = clockService.getTime();
  }
}

// Start updating the clock every second
setInterval(updateClockDisplay, 1000);