
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import CategoryList from "../categories/CategoryList";
import ImportExport from "./ImportExport";
import { Moon, Sun } from "lucide-react";

export default function SettingsPanel() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme-toggle">Theme</Label>
              <div className="text-sm text-muted-foreground">
                Switch between dark and light mode
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <CategoryList />
      
      <ImportExport />
      
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You can log out of your account here. Your data will remain saved for when you log back in.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={logout} className="text-destructive">
            Log out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
