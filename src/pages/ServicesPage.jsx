import { useMemo, useState } from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { useServices } from '../context/ServicesContext.jsx';
import ServiceBookingModal from '../components/ServiceBookingModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const categoryLabels = {
  SPA: 'SPA & Wellness',
  MASSAGE: 'Массаж',
  BAR: 'Бар',
  CAFE: 'Кофейня',
  POOL: 'Бассейн',
  GYM: 'Фитнес',
  ROOM_SERVICE: 'Room Service',
};

const ServicesPage = () => {
  const { services, setCategory, category, isLoading, error, refresh } = useServices();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);

  const groupedServices = useMemo(() => {
    const groups = {};
    services.forEach((service) => {
      const cat = service.category ?? 'OTHER';
      groups[cat] = groups[cat] ?? [];
      groups[cat].push(service);
    });
    return groups;
  }, [services]);

  return (
    <AnimatedPage>
      <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-12">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <header className="space-y-4 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900">Дополнительные услуги QonaqUi</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Мы предлагаем широкий спектр услуг для вашего комфортного отдыха: расслабляющие SPA процедуры,
              спортивные активности, гастрономические удовольствия и сервисы для бизнеса.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setCategory(undefined)}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                  !category ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 hover:bg-blue-50'
                }`}
              >
                Все
              </button>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                    category === key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-600 hover:bg-blue-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </header>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
              <button onClick={() => refresh()} className="ml-3 underline">
                Повторить попытку
              </button>
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
              В данный момент дополнительные услуги недоступны.
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedServices).map(([cat, items]) => (
                <section key={cat} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {categoryLabels[cat] ?? cat}
                    </h2>
                    <span className="text-sm text-gray-500">{items.length} услуг</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((service) => (
                      <article
                        key={service.id}
                        className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4 hover:shadow-lg transition"
                      >
                        <header className="space-y-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {service.durationMinutes
                              ? `${service.durationMinutes} минут`
                              : 'Гибкий график'}
                          </p>
                        </header>
                        <p className="text-gray-600 text-sm flex-1">{service.description}</p>
                        {service.availability && (
                          <div className="rounded-lg bg-blue-50 text-blue-800 text-xs p-3">
                            <p>Доступность:</p>
                            <p>Дни: {service.availability.days?.join(', ') ?? 'по запросу'}</p>
                            <p>Время: {service.availability.hours?.join(', ') ?? 'по запросу'}</p>
                          </div>
                        )}
                        <footer className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue-600">
                            {Number(service.price ?? 0).toLocaleString()} ₸
                          </span>
                          <button
                            onClick={() => {
                              if (!isAuthenticated) {
                                navigate('/login');
                              } else {
                                setSelectedService(service);
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                          >
                            Забронировать
                          </button>
                        </footer>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
        <ServiceBookingModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onBooked={() => refresh()}
        />
      </div>
    </AnimatedPage>
  );
};

export default ServicesPage;
