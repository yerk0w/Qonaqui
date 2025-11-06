import { Link, useNavigate } from "react-router-dom";
import {
  Hotel,
  LogOut,
  ChevronDown,
  User,
  Calendar,
  Briefcase,
  CreditCard,
  Star,
  MessageSquare,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../context/AuthContext.jsx";

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const profileMenuItems = [
    { path: "/profile", label: "Профиль", icon: User },
    { path: "/profile/bookings", label: "Бронирования", icon: Calendar },
    { path: "/profile/services", label: "Услуги", icon: Briefcase },
    { path: "/profile/payments", label: "Платежи", icon: CreditCard },
    { path: "/profile/loyalty", label: "Лояльность", icon: Star },
    { path: "/profile/reviews", label: "Отзывы", icon: MessageSquare },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Hotel className="text-blue-600" size={28} />
          <span className="text-2xl font-bold text-gray-800 tracking-tight">
            QonaqUi
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/rooms"
            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            {t("header.rooms")}
          </Link>
          <Link
            to="/services"
            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            {t("header.services")}
          </Link>
          <Link
            to="/building-map"
            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            {t("header.map")}
          </Link>
          <Link
            to="/about"
            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            {t("header.about")}
          </Link>
          <Link
            to="/contact"
            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            {t("header.contact")}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Dropdown меню профиля */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">
                    {user?.name || "Профиль"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Выпадающее меню */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-fadeIn">
                    {profileMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <Icon size={18} />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      );
                    })}

                    {/* Разделитель */}
                    <div className="border-t border-gray-200 my-2"></div>

                    {/* Админ панель (если админ) */}
                    {user?.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Hotel size={18} />
                        <span className="font-medium">Админ панель</span>
                      </Link>
                    )}

                    {/* Ресепшен панель (если ресепшионист) */}
                    {user?.role === "RECEPTIONIST" && (
                      <Link
                        to="/receptionist"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Hotel size={18} />
                        <span className="font-medium">Ресепшен</span>
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Кнопка выхода */}
              <button
                onClick={handleLogout}
                title={t("header.logout")}
                className="border-2 border-red-500 text-red-500 px-3 py-2 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="border-2 border-blue-600 text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              {t("header.login")}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
