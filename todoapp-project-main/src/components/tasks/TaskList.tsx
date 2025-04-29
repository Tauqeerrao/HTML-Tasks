import { useState } from "react";
import { useTodo } from "@/contexts/TodoContext";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Check, CheckCheck, Filter, Plus, Search, Trash, X } from "lucide-react";
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
import { SortOption } from "@/types/todo";

export default function TaskList() {
  const {
    filteredTasks,
    filters,
    updateFilters,
    clearFilters,
    categories,
    sortOption,
    setSortOption,
    selectedTasks,
    selectAllTasks,
    clearSelectedTasks,
    batchDeleteTasks,
    batchCompleteTasks,
  } = useTodo();

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchTerm);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ searchTerm: searchInput });
  };

  const handleSearchReset = () => {
    setSearchInput("");
    updateFilters({ searchTerm: "" });
  };

  const handleBatchDelete = () => {
    if (selectedTasks.size > 0) {
      setIsBatchDeleteDialogOpen(true);
    }
  };

  const confirmBatchDelete = () => {
    batchDeleteTasks();
    setIsBatchDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Add Task Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button onClick={() => setIsAddingTask(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Task
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
            {searchInput && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full"
                onClick={handleSearchReset}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>

        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.status}
            onValueChange={(value) => updateFilters({ status: value as any })}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.category === "all" ? "all" : filters.category}
            onValueChange={(value) => updateFilters({ category: value })}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
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

          <Select
            value={filters.priority}
            onValueChange={(value) => updateFilters({ priority: value as any })}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high" className="text-red-500">High</SelectItem>
              <SelectItem value="medium" className="text-amber-500">Medium</SelectItem>
              <SelectItem value="low" className="text-green-500">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.dateRange}
            onValueChange={(value) => updateFilters({ dateRange: value as any })}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={clearFilters}
            title="Clear filters"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Batch Actions */}
        <div className="flex items-center gap-2">
          {selectedTasks.size > 0 ? (
            <>
              <span className="text-sm">{selectedTasks.size} selected</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => batchCompleteTasks(true)}
                title="Mark selected as complete"
              >
                <CheckCheck className="h-4 w-4 mr-1" /> Complete
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => batchCompleteTasks(false)}
                title="Mark selected as active"
              >
                <X className="h-4 w-4 mr-1" /> Uncomplete
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleBatchDelete}
                title="Delete selected tasks"
              >
                <Trash className="h-4 w-4 mr-1" /> Delete
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={clearSelectedTasks}
                title="Clear selection"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={selectAllTasks}
            >
              Select All
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => <TaskItem key={task.id} task={task} />)
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">
              {filters.searchTerm || 
               filters.status !== "all" || 
               filters.category !== "all" || 
               filters.priority !== "all" || 
               filters.dateRange !== "all" 
                ? "No tasks match your filters"
                : "No tasks yet"}
            </p>
            <Button onClick={() => setIsAddingTask(true)}>Add your first task</Button>
          </div>
        )}
      </div>

      {/* Add Task Dialog */}
      <TaskForm
        open={isAddingTask}
        onClose={() => setIsAddingTask(false)}
        mode="create"
      />

      {/* Batch Delete Confirmation Dialog */}
      <AlertDialog open={isBatchDeleteDialogOpen} onOpenChange={setIsBatchDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedTasks.size} selected tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBatchDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
