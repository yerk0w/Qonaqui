import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { roomsService } from "../../services/roomsService";

const roomTypes = [
  { value: "STANDARD", label: "Стандарт" },
  { value: "DELUXE", label: "Делюкс" },
  { value: "SUITE", label: "Люкс" },
  { value: "PRESIDENTIAL", label: "Президентский" },
];

const bedTypes = [
  { value: "SINGLE", label: "Одноместная" },
  { value: "DOUBLE", label: "Двуспальная" },
  { value: "TWIN", label: "Две односпальные" },
  { value: "KING", label: "King-size" },
];

const statusOptions = [
  { value: "AVAILABLE", label: "Доступен" },
  { value: "OCCUPIED", label: "Занят" },
  { value: "RESERVED", label: "Забронирован" },
  { value: "MAINTENANCE", label: "Ремонт" },
  { value: "CLEANING", label: "Уборка" },
];

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [formData, setFormData] = useState({
    number: "",
    floor: 1,
    type: "STANDARD",
    capacity: 2,
    price: 25000,
    area: 25,
    bedType: "DOUBLE",
    amenities: [],
    photos: [],
    description: "",
    status: "AVAILABLE",
    coordinates: { floor: 1, x: 0, y: 0 },
  });

  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await roomsService.list();
      setRooms(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await roomsService.update(editingRoom.id, formData);
      } else {
        await roomsService.create(formData);
      }
      loadRooms();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      number: room.number,
      floor: room.floor,
      type: room.type,
      capacity: room.capacity,
      price: room.price,
      area: room.area,
      bedType: room.bedType,
      amenities: room.amenities || [],
      photos: room.photos || [],
      description: room.description || "",
      status: room.status,
      coordinates: room.coordinates || { floor: room.floor, x: 0, y: 0 },
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить этот номер?")) return;
    try {
      await roomsService.remove(id);
      loadRooms();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      number: "",
      floor: 1,
      type: "STANDARD",
      capacity: 2,
      price: 25000,
      area: 25,
      bedType: "DOUBLE",
      amenities: [],
      photos: [],
      description: "",
      status: "AVAILABLE",
      coordinates: { floor: 1, x: 0, y: 0 },
    });
    setEditingRoom(null);
    setShowForm(false);
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const commonAmenities = [
    "Wi-Fi",
    "Кондиционер",
    "Телевизор",
    "Мини-бар",
    "Балкон",
    "Джакузи",
    "Сейф",
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Управление номерами
          </h1>
          <p className="text-gray-600">
            Создавайте и редактируйте номера отеля
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus size={20} />
          {showForm ? "Отмена" : "Создать номер"}
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
            {editingRoom ? "Редактировать номер" : "Новый номер"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Номер комнаты *
              </label>
              <input
                type="text"
                required
                value={formData.number}
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Этаж *
              </label>
              <input
                type="number"
                required
                min="1"
                max="20"
                value={formData.floor}
                onChange={(e) =>
                  setFormData({ ...formData, floor: Number(e.target.value) })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип номера *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                {roomTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Вместимость *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: Number(e.target.value) })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
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
                Площадь (м²) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.1"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: Number(e.target.value) })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип кровати *
              </label>
              <select
                required
                value={formData.bedType}
                onChange={(e) =>
                  setFormData({ ...formData, bedType: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                {bedTypes.map((bed) => (
                  <option key={bed.value} value={bed.value}>
                    {bed.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Удобства
            </label>
            <div className="flex flex-wrap gap-2">
              {commonAmenities.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    formData.amenities.includes(amenity)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {amenity}
                </button>
              ))}
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
              placeholder="Описание номера..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фото (URL, по одному на строку)
            </label>
            <textarea
              rows={3}
              value={formData.photos.join("\n")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  photos: e.target.value.split("\n").filter((p) => p.trim()),
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {editingRoom ? "Сохранить изменения" : "Создать номер"}
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
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-sm p-6 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Номер {room.number}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Этаж {room.floor} • {room.type}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(room)}
                    className="text-blue-600 hover:text-blue-700 transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {Number(room.price).toLocaleString()} ₸
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Вместимость: {room.capacity} чел.</p>
                <p>Площадь: {room.area} м²</p>
                <p>
                  Статус:{" "}
                  {statusOptions.find((s) => s.value === room.status)?.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
