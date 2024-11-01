export interface Todo {
    id: number;
    text: string;
    completed: boolean;
    dueDate?: string;
    priority: 'Low' | 'Medium' | 'High';
    tags?: string[];
  }