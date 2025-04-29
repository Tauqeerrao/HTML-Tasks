
import { useState } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { Task } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TaskForm from "./TaskForm";
import { Check, Edit, MoreVertical, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { toggleTaskCompletion, deleteTask, toggleSelectTask, selectedTasks, categories } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const isSelected = selectedTasks.has(task.id);
  const category = categories.find(c => c.id === task.category);
  
  const handleToggleCompletion = (value: boolean) => {
    toggleTaskCompletion(task.id);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    deleteTask(task.id);
    setIsDeleteDialogOpen(false);
  };

  const handleSelect = () => {
    toggleSelectTask(task.id);
  };
  
  // Determine priority styling
  const priorityStyles = {
    high: "border-red-500",
    medium: "border-amber-500",
    low: "border-green-500",
  };
  
  return (
    <>
      <div 
        className={cn(
          "group relative border rounded-lg p-4 transition-all hover:shadow-md",
          task.completed ? "bg-muted/30" : "bg-card",
          isSelected ? "ring-2 ring-primary" : "",
          priorityStyles[task.priority]
        )}
      >
        {/* Task selection checkbox */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={handleSelect}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100"
          />
        </div>
        
        <div className="ml-6 flex items-start gap-3">
          {/* Completion checkbox */}
          <Checkbox 
            checked={task.completed}
            onCheckedChange={handleToggleCompletion}
            className={cn(
              "mt-1",
              task.priority === "high" ? "text-red-500" : 
              task.priority === "medium" ? "text-amber-500" : "text-green-500"
            )}
          />
          
          <div className="flex-1 space-y-1">
            {/* Task title and badges */}
            <div className="flex flex-wrap items-center gap-2">
              <h3 
                className={cn(
                  "text-base font-medium",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </h3>
              
              {/* Display category badge */}
              {category && (
                <Badge 
                  variant="outline"
                  className="text-xs"
                  style={{ 
                    borderColor: category.color,
                    color: category.color
                  }}
                >
                  {category.name}
                </Badge>
              )}
              
              {/* Priority badge */}
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  task.priority === "high" ? "priority-high" : 
                  task.priority === "medium" ? "priority-medium" : "priority-low"
                )}
              >
                {task.priority === "high" ? "High" : 
                 task.priority === "medium" ? "Medium" : "Low"}
              </Badge>
            </div>
            
            {/* Task description */}
            {task.description && (
              <p 
                className={cn(
                  "text-sm text-muted-foreground",
                  task.completed && "line-through"
                )}
              >
                {task.description}
              </p>
            )}
            
            {/* Due date and actions */}
            <div className="flex justify-between items-center pt-2">
              {task.dueDate ? (
                <p 
                  className={cn(
                    "text-xs",
                    new Date(task.dueDate) < new Date() && !task.completed 
                      ? "text-destructive" 
                      : "text-muted-foreground"
                  )}
                >
                  Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                </p>
              ) : (
                <span className="text-xs text-muted-foreground">No due date</span>
              )}
              
              {/* Action buttons */}
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleEdit}
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleDelete}
                  className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Task Dialog */}
      <TaskForm
        open={isEditing}
        onClose={() => setIsEditing(false)}
        initialTask={task}
        mode="edit"
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task "{task.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
