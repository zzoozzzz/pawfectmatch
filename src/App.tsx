import { useState, useEffect, useRef } from "react";
import { Navigation } from "./components/Navigation";
import { LandingPage } from "./components/LandingPage";
import { TasksPage } from "./components/TasksPage";
import { FindHelpersPage } from "./components/FindHelpersPage";
import { TaskDetailPage } from "./components/TaskDetailPage";
import { PostTaskPage } from "./components/PostTaskPage";
import { MessagesPage } from "./components/MessagesPage";
import { ProfilePage } from "./components/ProfilePage";
import { AuthPage } from "./components/AuthPage";
import { Toaster } from "sonner";
import { useUser } from "./hooks/useUser";

export default function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [navigationParams, setNavigationParams] = useState<Record<string, any>>({});
  const scrollPositions = useRef<Record<string, number>>({});
  const { isAuthenticated, loading: userLoading } = useUser();

  // Protected routes that require authentication
  const protectedRoutes = [
    'tasks',
    'task-detail',
    'find-helpers',
    'post-task',
    'profile',
    'messages'
  ];
  
  // Check if current route requires authentication
  const requiresAuth = protectedRoutes.includes(currentPage);

  const handleNavigate = (page: string, params?: Record<string, any>) => {
    // Save current scroll position before navigating
    scrollPositions.current[currentPage] = window.scrollY;
    setCurrentPage(page);
    setNavigationParams(params || {});
  };

  useEffect(() => {
    // Restore scroll position after page change
    const savedPosition = scrollPositions.current[currentPage] || 0;
    window.scrollTo(0, savedPosition);
  }, [currentPage]);

  useEffect(() => {
    fetch("http://localhost:3001/api/health")
      .then(res => res.json())
      .then(data => console.log("✅ Backend:", data))
      .catch(err => console.error("❌ Connection failed:", err));
  }, []);

  // Route protection - only runs after loading completes
  useEffect(() => {
    if (userLoading) return;

    if (requiresAuth && !isAuthenticated) {
      setCurrentPage("auth");
    }
  }, [userLoading, isAuthenticated, requiresAuth]);

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={handleNavigate} />;
      case "tasks":
        return <TasksPage onNavigate={handleNavigate} />;
      case "find-helpers":
        return <FindHelpersPage onNavigate={handleNavigate} />;
      case "task-detail":
        return <TaskDetailPage onNavigate={handleNavigate} taskId={navigationParams.taskId} />;
      case "post-task":
        return <PostTaskPage onNavigate={handleNavigate} />;
      case "messages":
        return <MessagesPage onNavigate={handleNavigate} selectedUserId={navigationParams.selectedUserId} />;
      case "profile":
        return <ProfilePage onNavigate={handleNavigate} userType={navigationParams.userType} />;
      case "auth":
        return <AuthPage onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {currentPage !== "auth" && (
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      )}
      {renderPage()}
      <Toaster position="top-center" richColors />
    </div>
  );
}