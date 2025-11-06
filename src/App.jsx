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
import MyBookings from './pages/client/MyBookings.jsx';
import MyServices from './pages/client/MyServices.jsx';
import MyPayments from './pages/client/MyPayments.jsx';
import MyLoyalty from './pages/client/MyLoyalty.jsx';
import MyReviews from './pages/client/MyReviews.jsx';
import BookingProcess from './pages/client/BookingProcess.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import BuildingMapPage from './pages/BuildingMapPage.jsx';

import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBookings from './pages/admin/AdminBookings.jsx';
import AdminServices from './pages/admin/AdminServices.jsx';
import AdminRooms from "./pages/admin/AdminRooms.jsx";
import AdminServicesManagement from "./pages/admin/AdminServicesManagement.jsx";
import AdminFinances from './pages/admin/AdminFinances.jsx';
import AdminReviews from './pages/admin/AdminReviews.jsx';
import ReceptionLayout from './pages/receptionist/ReceptionLayout.jsx';
import ReceptionDashboard from './pages/receptionist/ReceptionDashboard.jsx';
import ReceptionBookings from './pages/receptionist/ReceptionBookings.jsx';

function App() {
  const location = useLocation();

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {!location.pathname.startsWith("/admin") &&
        !location.pathname.startsWith("/receptionist") && <Header />}

      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<ResultsPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/building-map" element={<BuildingMapPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/bookings" element={<MyBookings />} />
            <Route path="/profile/services" element={<MyServices />} />
            <Route path="/profile/payments" element={<MyPayments />} />
            <Route path="/profile/loyalty" element={<MyLoyalty />} />
            <Route path="/profile/reviews" element={<MyReviews />} />
            <Route path="/booking/:roomId" element={<BookingProcess />} />

            <Route
              path="/admin"
              element={<AdminRoute allowedRoles={["ADMIN"]} />}
            >
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="rooms" element={<AdminRooms />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route
                  path="services"
                  element={<AdminServicesManagement />}
                />{" "}
                <Route path="finances" element={<AdminFinances />} />
                <Route path="reviews" element={<AdminReviews />} />
              </Route>
            </Route>

            <Route
              path="/receptionist"
              element={<AdminRoute allowedRoles={["RECEPTIONIST", "ADMIN"]} />}
            >
              <Route element={<ReceptionLayout />}>
                <Route index element={<ReceptionDashboard />} />
                <Route path="bookings" element={<ReceptionBookings />} />
              </Route>
            </Route>
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
