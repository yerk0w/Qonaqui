import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { servicesService } from "../../services/servicesService";

const categories = [
  { value: "SPA", label: "SPA & Wellness" },
  { value: "MASSAGE", label: "Массаж" },
  { value: "BAR", label: "Бар" },
  { value: "CAFE", label: "Кофейня" },
  { value: "POOL", label: "Бассейн" },
  { value: "GYM", label: "Фитнес" },
  { value: "ROOM_SERVICE", label: "Room Service" },
];

const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const AdminServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "SPA",
    description: "",
    price: 0,
    durationMinutes: null,
    availability: {
      days: [],
      hours: [],
    },
    photo: "",
  });

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await servicesService.list();
      setServices(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        durationMinutes: formData.durationMinutes
          ? Number(formData.durationMinutes)
          : null,
      };

      if (editingService) {
        await servicesService.update(editingService.id, payload);
      } else {
        await servicesService.create(payload);
      }

      loadServices();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description || "",
      price: service.price,
      durationMinutes: service.durationMinutes,
      availability: service.availability || { days: [], hours: [] },
      photo: service.photo || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить эту услугу?")) return;
    try {
      await servicesService.remove(id);
      loadServices();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "SPA",
      description: "",
      price: 0,
      durationMinutes: null,
      availability: { days: [], hours: [] },
      photo: "",
    });
    setEditingService(null);
    setShowForm(false);
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter((d) => d !== day)
          : [...prev.availability.days, day],
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Управление услугами
          </h1>
          <p className="text-gray-600">
            Создавайте и редактируйте дополнительные услуги отеля
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus size={20} />
          {showForm ? "Отмена" : "Создать услугу"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md space-y-6"
        >
          <h2 className="text-xl font-semibold">
            {editingService ? "Редактировать услугу" : "Новая услуга"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название услуги *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Массаж спины"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цена (₸) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Длительность (минуты)
              </label>
              <input
                type="number"
                min="0"
                value={formData.durationMinutes || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationMinutes: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="60"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Описание услуги..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Доступность (дни недели)
            </label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    formData.availability.days.includes(day)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Часы работы (например: 09:00-18:00)
            </label>
            <input
              type="text"
              value={formData.availability.hours.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  availability: {
                    ...formData.availability,
                    hours: e.target.value
                      .split(",")
                      .map((h) => h.trim())
                      .filter(Boolean),
                  },
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="09:00-18:00, 19:00-22:00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фото (URL)
            </label>
            <input
              type="url"
              value={formData.photo}
              onChange={(e) =>
                setFormData({ ...formData, photo: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {editingService ? "Сохранить изменения" : "Создать услугу"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-sm p-6 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {service.name}
                  </h3>
                  <span className="text-xs font-semibold uppercase text-blue-500 bg-blue-50 px-2 py-1 rounded">
                    {
                      categories.find((c) => c.value === service.category)
                        ?.label
                    }
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-blue-600 hover:text-blue-700 transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm line-clamp-3">
                {service.description}
              </p>
              <div className="flex justify-between items-center pt-3 border-t">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {Number(service.price).toLocaleString()} ₸
                  </p>
                  {service.durationMinutes && (
                    <p className="text-gray-500 text-sm">
                      {service.durationMinutes} минут
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
              Услуги не найдены. Создайте первую услугу!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminServicesManagement;
