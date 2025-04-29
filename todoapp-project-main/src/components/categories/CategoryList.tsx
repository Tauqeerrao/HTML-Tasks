
import { useState } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import CategoryDialog from "./CategoryDialog";

export default function CategoryList() {
  const { categories, deleteCategory } = useTodo();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingCategory(id);
  };

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Categories</h2>
        <Button onClick={() => setIsAddingCategory(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <CardTitle>{category.name}</CardTitle>
              </div>
            </CardHeader>
            <CardFooter className="pt-2 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(category.id)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => handleDelete(category.id)}
              >
                <Trash className="h-4 w-4 mr-1" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Category Dialog */}
      <CategoryDialog
        open={isAddingCategory}
        onClose={() => setIsAddingCategory(false)}
        mode="create"
      />

      {/* Edit Category Dialog */}
      {editingCategory && (
        <CategoryDialog
          open={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          initialCategory={categories.find((c) => c.id === editingCategory)}
          mode="edit"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={() => setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete the category and
              reset all tasks using it to another category.
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
    </div>
  );
}
