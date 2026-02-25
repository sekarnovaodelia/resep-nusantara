import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RecipeProvider } from './context/RecipeContext';
import { SocialProvider } from './context/SocialContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { NotificationProvider } from './context/NotificationContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import CookingMode from './pages/CookingMode';
import Planner from './pages/Planner';
import ShoppingList from './pages/ShoppingList';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Community from './pages/Community';
import UploadRecipe from './pages/UploadRecipe';
import EditRecipe from './pages/EditRecipe';
import PostDetail from './pages/PostDetail';
import NotificationPage from './pages/NotificationPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/admin/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        return savedMode === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  return (
    <AuthProvider>
      <RecipeProvider>
        <SocialProvider>
          <BookmarkProvider>
            <NotificationProvider>
              <Router>
                <ScrollToTop />
                <MainLayout darkMode={darkMode} setDarkMode={setDarkMode} />
              </Router>
            </NotificationProvider>
          </BookmarkProvider>
        </SocialProvider>
      </RecipeProvider>
    </AuthProvider>
  );
};

const MainLayout = ({ darkMode, setDarkMode }) => {
  return (
    <AppContent darkMode={darkMode} setDarkMode={setDarkMode} />
  );
};

// Helper component to use authentication-aware layout
const AppContent = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 font-display transition-colors duration-200">
      {!isAuthPage && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}

      <main className={`flex-1 ${!isAuthPage ? 'pb-20 lg:pb-0' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate replace to="/" />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/recipe/:id/cook" element={<CookingMode />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/community" element={<Community />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/public-profile" element={<PublicProfile />} />
          <Route path="/upload-recipe" element={<ProtectedRoute><UploadRecipe /></ProtectedRoute>} />
          <Route path="/recipe/:id/edit" element={<ProtectedRoute><EditRecipe /></ProtectedRoute>} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
      {!isAuthPage && <BottomNav />}
    </div>
  );
};

export default App;