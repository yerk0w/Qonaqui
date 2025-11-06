import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Lock, User, AlertCircle } from "lucide-react";

// URL нашего бэкенда (Java Spring Boot на порту 4000)
const API_URL = "http://localhost:4000/api/auth";

const AuthForm = ({ isLogin, backgroundImage }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = isLogin ? "/login" : "/register";
    const url = API_URL + endpoint;

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Что-то пошло не так");
      }

      // Сохраняем токен
      localStorage.setItem("token", data.token);

      // Перенаправляем на главную
      navigate("/");
    } catch (err) {
      console.error("Ошибка при запросе:", err);
      if (err.message === "Failed to fetch") {
        setError(
          "❌ Не удается подключиться к серверу. Убедитесь, что Java бэкенд запущен на http://localhost:4000"
        );
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-cover bg-center relative p-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {isLogin ? t("auth.login_title") : t("auth.register_title")}
        </h2>
        <p className="text-center text-gray-500 mb-8">
          {isLogin ? t("auth.login_subtitle") : t("auth.register_subtitle")}
        </p>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <div className="flex">
              <AlertCircle className="mr-2" />
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative">
              <User className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder={t("auth.name_placeholder")}
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder={t("auth.email_placeholder")}
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder={t("auth.password_placeholder")}
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading
              ? isLogin
                ? "Вход..."
                : "Регистрация..."
              : isLogin
              ? t("auth.login_btn")
              : t("auth.register_btn")}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            {isLogin ? t("auth.no_account") : t("auth.has_account")}
            <Link
              to={isLogin ? "/register" : "/login"}
              className="text-blue-600 font-semibold hover:underline"
            >
              {isLogin ? t("auth.register_link") : t("auth.login_link")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
