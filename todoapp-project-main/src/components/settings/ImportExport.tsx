
import { useState, useRef } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Upload } from "lucide-react";

export default function ImportExport() {
  const { exportTodos, importTodos } = useTodo();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExport = () => {
    exportTodos();
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Only accept JSON files
    if (file.type !== 'application/json') {
      toast({
        title: "Invalid file type",
        description: "Please select a JSON file",
        variant: "destructive",
      });
      return;
    }
    
    // Read the file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content === 'string') {
          importTodos(content);
        }
      } catch (error) {
        toast({
          title: "Error importing file",
          description: "The selected file could not be parsed",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
    
    // Reset the file input for future imports
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup & Restore</CardTitle>
        <CardDescription>Export or import your tasks and categories</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Export your data to back it up or transfer it to another device.
          You can also import previously exported data.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" /> Export Data
        </Button>
        <div>
          <Input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button onClick={handleImportClick}>
            <Upload className="h-4 w-4 mr-2" /> Import Data
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
