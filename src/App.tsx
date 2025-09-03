import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import { Landing } from "./pages/Landing";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { Dashboard } from "./pages/Dashboard";
import { Databases } from "./pages/Databases";
import { Visualizer } from "./pages/Visualizer";
import { AdminUsers } from "./pages/AdminUsers";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Layout and routes
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AdminRoute } from "./routes/AdminRoute";

// Store initialization
import './store/theme.store'; // Initialize theme

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            
            {/* Protected app routes - using /app prefix to avoid conflicts */}
            <Route path="/app" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="databases" element={<Databases />} />
              <Route path="visualizer" element={<Visualizer />} />
              <Route path="visualizer/:databaseId" element={<Visualizer />} />
              <Route path="settings" element={<Settings />} />
              
              {/* Admin only routes */}
              <Route path="admin/users" element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              } />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
