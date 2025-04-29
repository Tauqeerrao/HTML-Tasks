
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/dashboard/Dashboard";
import AuthModal from "@/components/auth/AuthModal";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-lg">Loading...</p>
            </div>
          </div>
        ) : isAuthenticated ? (
          <Dashboard />
        ) : (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">TaskNexus</h1>
              <p className="text-xl text-muted-foreground">The smart way to manage your tasks and boost productivity</p>
            </div>
            <AuthModal />
          </div>
        )}
      </main>
      
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} TaskNexus. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
