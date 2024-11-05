import { Todo } from '../types/types';

export class TodoService {
  private static instance: TodoService;
  private todos: Todo[] = [];

  private constructor() {
    this.loadFromLocalStorage();
  }

  static getInstance(): TodoService {
    if (!TodoService.instance) {
      TodoService.instance = new TodoService();
    }
    return TodoService.instance;
  }

  private loadFromLocalStorage(): void {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      this.todos = JSON.parse(storedTodos);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  getTodos(): Todo[] {
    return this.todos;
  }

  addTodo(text: string, dueDate?: string, priority: 'Low' | 'Medium' | 'High' = 'Low'): void {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      dueDate,
      priority
    };
    this.todos.push(newTodo);
    this.saveToLocalStorage();
  }

  toggleTodo(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveToLocalStorage();
    }
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveToLocalStorage();
  }

  editTodo(id: number, text: string): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.text = text;
      this.saveToLocalStorage();
    }
  }

  clearCompleted(): void {
    this.todos = this.todos.filter(todo => !todo.completed);
    this.saveToLocalStorage();
  }

  toggleAll(): void {
    const allCompleted = this.todos.every(todo => todo.completed);
    this.todos.forEach(todo => todo.completed = !allCompleted);
    this.saveToLocalStorage();
  }
}
