
import { useState, useEffect } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { Task, Priority } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  initialTask?: Task;
  mode: "create" | "edit";
}

const emptyTask: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  description: "",
  completed: false,
  category: "",
  priority: "medium",
  notes: "",
};

export default function TaskForm({
  open,
  onClose,
  initialTask,
  mode,
}: TaskFormProps) {
  const { addTask, updateTask, categories } = useTodo();
  const [task, setTask] = useState<Omit<Task, "id" | "createdAt" | "updatedAt">>(
    initialTask
      ? {
          title: initialTask.title,
          description: initialTask.description || "",
          completed: initialTask.completed,
          dueDate: initialTask.dueDate,
          category: initialTask.category,
          priority: initialTask.priority,
          notes: initialTask.notes || "",
        }
      : { ...emptyTask, category: categories[0]?.id || "" }
  );

  // Update form when initialTask changes
  useEffect(() => {
    if (initialTask) {
      setTask({
        title: initialTask.title,
        description: initialTask.description || "",
        completed: initialTask.completed,
        dueDate: initialTask.dueDate,
        category: initialTask.category,
        priority: initialTask.priority,
        notes: initialTask.notes || "",
      });
    } else {
      setTask({ ...emptyTask, category: categories[0]?.id || "" });
    }
  }, [initialTask, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task.title.trim()) {
      return; // Don't submit if title is empty
    }
    
    if (mode === "create") {
      addTask(task);
    } else if (initialTask) {
      updateTask(initialTask.id, task);
    }
    
    onClose();
    // Reset form
    setTask({ ...emptyTask, category: categories[0]?.id || "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setTask((prev) => ({ ...prev, dueDate: date }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Task" : "Edit Task"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new task with details"
              : "Update your task details"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Task title"
                value={task.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Task description (optional)"
                value={task.description}
                onChange={handleChange}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                value={task.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }} 
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  name="priority"
                  value={task.priority}
                  onValueChange={(value) =>
                    handleSelectChange("priority", value as Priority)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high" className="text-red-500">High</SelectItem>
                    <SelectItem value="medium" className="text-amber-500">Medium</SelectItem>
                    <SelectItem value="low" className="text-green-500">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !task.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {task.dueDate ? (
                        format(task.dueDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={task.dueDate}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                    {task.dueDate && (
                      <div className="p-2 border-t border-border">
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => handleDateChange(undefined)}
                        >
                          Clear date
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional notes (optional)"
                value={task.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create Task" : "Update Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
