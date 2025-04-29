
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Task, Category, TodoFilters, Priority, SortOption, FilterStatus, FilterPriority, FilterDate } from "@/types/todo";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";

interface TodoContextType {
  tasks: Task[];
  categories: Category[];
  filters: TodoFilters;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, "id">>) => void;
  deleteCategory: (id: string) => void;
  filteredTasks: Task[];
  updateFilters: (newFilters: Partial<TodoFilters>) => void;
  clearFilters: () => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  exportTodos: () => void;
  importTodos: (data: string) => void;
  selectedTasks: Set<string>;
  toggleSelectTask: (id: string) => void;
  selectAllTasks: () => void;
  clearSelectedTasks: () => void;
  batchDeleteTasks: () => void;
  batchCompleteTasks: (completed: boolean) => void;
}

// Default categories
const defaultCategories: Category[] = [
  { id: "cat-1", name: "Personal", color: "#3b82f6" },
  { id: "cat-2", name: "Work", color: "#ef4444" },
  { id: "cat-3", name: "Shopping", color: "#10b981" },
  { id: "cat-4", name: "Health", color: "#f97316" },
];

// Default filters
const defaultFilters: TodoFilters = {
  status: "all",
  category: "all",
  priority: "all",
  dateRange: "all",
  searchTerm: "",
};

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<TodoFilters>(defaultFilters);
  const [sortOption, setSortOption] = useState<SortOption>("dueDate");
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  // Load initial data from localStorage
  useEffect(() => {
    try {
      // Only load tasks when user is logged in
      if (user) {
        const storedTasks = localStorage.getItem(`tasks_${user.id}`);
        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks);
          // Convert date strings back to Date objects
          const tasksWithDates = parsedTasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          }));
          setTasks(tasksWithDates);
        }
        
        const storedCategories = localStorage.getItem(`categories_${user.id}`);
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
        } else {
          // Use default categories for new users
          setCategories(defaultCategories);
        }
      } else {
        // Clear tasks when logged out
        setTasks([]);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
      toast({
        title: "Error",
        description: "Could not load your tasks. Please try again.",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  // Save tasks and categories to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(tasks));
      localStorage.setItem(`categories_${user.id}`, JSON.stringify(categories));
    }
  }, [tasks, categories, user]);

  // Add a new task
  const addTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Task added",
      description: "Your task has been added successfully.",
    });
  };

  // Update a task
  const updateTask = (id: string, updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date() } 
          : task
      )
    );
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    // Also remove from selected tasks if it was selected
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    toast({
      title: "Task deleted",
      description: "Your task has been deleted.",
    });
  };

  // Toggle task completion
  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed, updatedAt: new Date() } 
          : task
      )
    );
  };

  // Add a new category
  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: generateId(),
    };
    setCategories(prev => [...prev, newCategory]);
    toast({
      title: "Category added",
      description: "Your category has been added successfully.",
    });
  };

  // Update a category
  const updateCategory = (id: string, updates: Partial<Omit<Category, "id">>) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === id 
          ? { ...category, ...updates } 
          : category
      )
    );
    toast({
      title: "Category updated",
      description: "Your category has been updated successfully.",
    });
  };

  // Delete a category (and update tasks using it)
  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
    // Reset tasks with this category to first available category or empty string
    setTasks(prev => 
      prev.map(task => 
        task.category === id 
          ? { ...task, category: categories[0]?.id || "" } 
          : task
      )
    );
    toast({
      title: "Category deleted",
      description: "Your category has been deleted successfully.",
    });
  };

  // Update filters
  const updateFilters = (newFilters: Partial<TodoFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  // Apply filters and sorting to tasks
  const filteredTasks = tasks
    .filter(task => {
      // Filter by status
      if (filters.status === "active" && task.completed) return false;
      if (filters.status === "completed" && !task.completed) return false;

      // Filter by category
      if (filters.category !== "all" && task.category !== filters.category) return false;

      // Filter by priority
      if (filters.priority !== "all" && task.priority !== filters.priority) return false;

      // Filter by date range
      if (filters.dateRange !== "all" && task.dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        
        if (filters.dateRange === "today") {
          if (taskDate.getTime() !== today.getTime()) return false;
        } else if (filters.dateRange === "week") {
          const weekLater = new Date(today);
          weekLater.setDate(today.getDate() + 7);
          if (taskDate < today || taskDate > weekLater) return false;
        } else if (filters.dateRange === "month") {
          const monthLater = new Date(today);
          monthLater.setMonth(today.getMonth() + 1);
          if (taskDate < today || taskDate > monthLater) return false;
        }
      }

      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) || 
          (task.description && task.description.toLowerCase().includes(searchLower)) ||
          (task.notes && task.notes.toLowerCase().includes(searchLower))
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by selected option
      if (sortOption === "name") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "dueDate") {
        // Sort by due date (tasks with no due date go to the end)
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortOption === "priority") {
        // Sort by priority (high > medium > low)
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortOption === "category") {
        const categoryA = categories.find(c => c.id === a.category)?.name || "";
        const categoryB = categories.find(c => c.id === b.category)?.name || "";
        return categoryA.localeCompare(categoryB);
      }
      return 0;
    });

  // Export tasks and categories as JSON
  const exportTodos = () => {
    try {
      const exportData = {
        tasks,
        categories
      };
      
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = "todo-app-data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Your tasks and categories have been exported.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    }
  };

  // Import tasks and categories from JSON
  const importTodos = (data: string) => {
    try {
      const importedData = JSON.parse(data);
      
      if (!importedData.tasks || !Array.isArray(importedData.tasks) || 
          !importedData.categories || !Array.isArray(importedData.categories)) {
        throw new Error("Invalid data format");
      }
      
      // Convert date strings back to Date objects
      const tasksWithDates = importedData.tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
      
      setTasks(tasksWithDates);
      setCategories(importedData.categories);
      
      toast({
        title: "Import successful",
        description: "Your tasks and categories have been imported.",
      });
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: "There was an error importing your data.",
        variant: "destructive",
      });
    }
  };

  // Toggle task selection
  const toggleSelectTask = (id: string) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Select all tasks
  const selectAllTasks = () => {
    const allIds = filteredTasks.map(task => task.id);
    setSelectedTasks(new Set(allIds));
  };

  // Clear selected tasks
  const clearSelectedTasks = () => {
    setSelectedTasks(new Set());
  };

  // Batch delete selected tasks
  const batchDeleteTasks = () => {
    const selectedArray = Array.from(selectedTasks);
    if (selectedArray.length === 0) return;
    
    setTasks(prev => prev.filter(task => !selectedTasks.has(task.id)));
    clearSelectedTasks();
    
    toast({
      title: "Tasks deleted",
      description: `${selectedArray.length} tasks have been deleted.`,
    });
  };

  // Batch complete/uncomplete selected tasks
  const batchCompleteTasks = (completed: boolean) => {
    const selectedArray = Array.from(selectedTasks);
    if (selectedArray.length === 0) return;
    
    setTasks(prev => 
      prev.map(task => 
        selectedTasks.has(task.id)
          ? { ...task, completed, updatedAt: new Date() }
          : task
      )
    );
    
    toast({
      title: completed ? "Tasks completed" : "Tasks marked active",
      description: `${selectedArray.length} tasks have been updated.`,
    });
  };

  return (
    <TodoContext.Provider
      value={{
        tasks,
        categories,
        filters,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        addCategory,
        updateCategory,
        deleteCategory,
        filteredTasks,
        updateFilters,
        clearFilters,
        sortOption,
        setSortOption,
        exportTodos,
        importTodos,
        selectedTasks,
        toggleSelectTask,
        selectAllTasks,
        clearSelectedTasks,
        batchDeleteTasks,
        batchCompleteTasks,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};
