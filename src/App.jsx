import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import RoomsPage from './pages/RoomsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  const location = useLocation();

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {!location.pathname.startsWith('/admin') && <Header />}
      
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<ResultsPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Route>

          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;