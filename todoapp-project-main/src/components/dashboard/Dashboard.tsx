
import { useState } from "react";
import { useTodo } from "@/contexts/TodoContext";
import TaskList from "../tasks/TaskList";
import SettingsPanel from "../settings/SettingsPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { format } from "date-fns";

export default function Dashboard() {
  const { filteredTasks, tasks } = useTodo();
  const [activeTab, setActiveTab] = useState("tasks");
  
  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Get today's and this week's tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfWeek = new Date();
  endOfWeek.setDate(today.getDate() + 7);
  
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  });
  
  const thisWeekTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate >= today && dueDate <= endOfWeek;
  });
  
  // Prepare chart data
  const statusData = [
    { name: "Completed", value: completedTasks },
    { name: "Active", value: activeTasks },
  ];
  
  const priorityData = [
    { name: "High", value: tasks.filter(task => task.priority === "high").length },
    { name: "Medium", value: tasks.filter(task => task.priority === "medium").length },
    { name: "Low", value: tasks.filter(task => task.priority === "low").length },
  ];
  
  const COLORS = {
    status: ["#10b981", "#6b7280"],
    priority: ["#ef4444", "#f59e0b", "#10b981"],
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <TaskList />
        </TabsContent>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="text-muted-foreground mb-1">Total Tasks</h3>
              <p className="text-3xl font-bold">{totalTasks}</p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="text-muted-foreground mb-1">Completed</h3>
              <p className="text-3xl font-bold text-green-500">{completedTasks}</p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="text-muted-foreground mb-1">Active</h3>
              <p className="text-3xl font-bold text-blue-500">{activeTasks}</p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="text-muted-foreground mb-1">Completion Rate</h3>
              <p className="text-3xl font-bold">{completionRate}%</p>
            </div>
          </div>
          
          {/* Charts */}
          {totalTasks > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg p-4 border h-72">
                <h3 className="font-semibold mb-4">Task Status</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.status[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-card rounded-lg p-4 border h-72">
                <h3 className="font-semibold mb-4">Task Priority</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.priority[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
          {/* Today's and Upcoming Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold mb-4">Today's Tasks ({todayTasks.length})</h3>
              {todayTasks.length > 0 ? (
                <ul className="space-y-2">
                  {todayTasks.map(task => (
                    <li key={task.id} className="p-2 rounded-md bg-background border">
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-2 h-2 rounded-full ${
                            task.priority === "high" ? "bg-red-500" : 
                            task.priority === "medium" ? "bg-amber-500" : "bg-green-500"
                          }`} 
                        />
                        <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                          {task.title}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">No tasks due today</p>
              )}
            </div>
            
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold mb-4">This Week's Tasks ({thisWeekTasks.length})</h3>
              {thisWeekTasks.length > 0 ? (
                <ul className="space-y-2">
                  {thisWeekTasks.map(task => (
                    <li key={task.id} className="p-2 rounded-md bg-background border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className={`w-2 h-2 rounded-full ${
                              task.priority === "high" ? "bg-red-500" : 
                              task.priority === "medium" ? "bg-amber-500" : "bg-green-500"
                            }`} 
                          />
                          <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                            {task.title}
                          </span>
                        </div>
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(task.dueDate), "MMM d")}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">No tasks due this week</p>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <SettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
