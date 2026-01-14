import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <MainLayout darkMode={darkMode} setDarkMode={setDarkMode} />
    </Router>
  );
};

const MainLayout = ({ darkMode, setDarkMode }) => {
  const location = window.location.pathname; // using window.location because useLocation needs to be inside Router, but we can standardly use useLocation if we extract content.
  // Actually simpler to just wrap content in a component that uses useLocation
  // Let's stick to the extracted component pattern for cleanliness or just use the hook inside a child of Router.
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          {/* Add more routes here for other pages */}
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
      {!isAuthPage && <BottomNav />}
    </div>
  );
};

export default App;