import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RecipeProvider } from './context/RecipeContext';
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
import UploadRecipeStep1 from './pages/UploadRecipeStep1';
import UploadRecipeStep2 from './pages/UploadRecipeStep2';
import UploadRecipeStep3 from './pages/UploadRecipeStep3';
import PostDetail from './pages/PostDetail';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <AuthProvider>
      <RecipeProvider>
        <Router>
          <MainLayout darkMode={darkMode} setDarkMode={setDarkMode} />
        </Router>
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
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 font-display transition-colors duration-200">
      {!isAuthPage && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}

      <main className={`flex-1 ${!isAuthPage ? 'pb-20 lg:pb-0' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/recipe/:id/cook" element={<CookingMode />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/community" element={<Community />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/public-profile" element={<PublicProfile />} />
          <Route path="/upload-recipe/step-1" element={<UploadRecipeStep1 />} />
          <Route path="/upload-recipe/step-2" element={<UploadRecipeStep2 />} />
          <Route path="/upload-recipe/step-3" element={<UploadRecipeStep3 />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
      {!isAuthPage && <BottomNav />}
    </div>
  );
};

export default App;