
import { useState, useEffect } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { Category } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HexColorPicker } from "react-colorful";

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  initialCategory?: Category;
  mode: "create" | "edit";
}

export default function CategoryDialog({
  open,
  onClose,
  initialCategory,
  mode,
}: CategoryDialogProps) {
  const { addCategory, updateCategory } = useTodo();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6"); // Default blue color
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Initialize form with category data when editing
  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.name);
      setColor(initialCategory.color);
    } else {
      setName("");
      setColor("#3b82f6");
    }
  }, [initialCategory, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return; // Don't submit if name is empty
    }
    
    if (mode === "create") {
      addCategory({ name, color });
    } else if (initialCategory) {
      updateCategory(initialCategory.id, { name, color });
    }
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Category" : "Edit Category"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new category for organizing your tasks"
              : "Update your category details"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-12 h-8 p-0 border-2"
                  style={{ backgroundColor: color }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                <Input
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#RRGGBB"
                  required
                />
              </div>
              {showColorPicker && (
                <div className="mt-2">
                  <HexColorPicker color={color} onChange={setColor} />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create Category" : "Update Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
