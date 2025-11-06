import { useEffect, useState } from 'react';
import { servicesService } from '../../services/servicesService';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await servicesService.list();
      setServices(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Услуги отеля</h1>
        <p className="text-gray-600">
          Управляйте списком дополнительных услуг. Здесь также отображается категория и стоимость.
        </p>
      </header>

      {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                <span className="text-xs font-semibold uppercase text-blue-500 bg-blue-50 px-2 py-1 rounded">
                  {service.category}
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-3">{service.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {Number(service.price ?? 0).toLocaleString()} ₸
                  </p>
                  {service.durationMinutes && (
                    <p className="text-gray-500 text-sm">{service.durationMinutes} минут</p>
                  )}
                </div>
                {service.availability && (
                  <div className="text-right text-xs text-gray-500">
                    <p>Дни: {service.availability.days?.join(', ') ?? 'по запросу'}</p>
                    <p>Время: {service.availability.hours?.join(', ') ?? 'по запросу'}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
              Услуги не найдены.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminServices;
