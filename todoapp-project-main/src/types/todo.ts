
export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  category: string;
  priority: Priority;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type SortOption = "name" | "dueDate" | "priority" | "category";
export type FilterStatus = "all" | "active" | "completed";
export type FilterPriority = Priority | "all";
export type FilterDate = "all" | "today" | "week" | "month";

export interface TodoFilters {
  status: FilterStatus;
  category: string;
  priority: FilterPriority;
  dateRange: FilterDate;
  searchTerm: string;
}
