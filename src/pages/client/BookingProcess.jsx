import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnimatedPage from '../../components/AnimatedPage';
import { roomsService } from '../../services/roomsService';
import { useServices } from '../../context/ServicesContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { bookingsService } from '../../services/bookingsService';
import { paymentsService } from '../../services/paymentsService';
import { differenceInCalendarDays, parseISO } from 'date-fns';

const steps = ['Даты проживания', 'Данные гостя', 'Дополнительные услуги', 'Оплата', 'Готово'];

const initialContact = (user) => ({
  guestName: user?.name ?? '',
  guestPhone: user?.phone ?? '',
  guestEmail: user?.email ?? '',
});

const calcNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const nights = differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));
  return nights > 0 ? nights : 0;
};

const BookingProcess = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const { services } = useServices();

  const [step, setStep] = useState(0);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dates, setDates] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const [contact, setContact] = useState(initialContact(user));
  const [selectedServices, setSelectedServices] = useState({});
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [paying, setPaying] = useState(false);
  const [card, setCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setContact(initialContact(user));
  }, [user]);

  useEffect(() => {
    const loadRoom = async () => {
      setLoading(true);
      try {
        const data = await roomsService.getById(roomId);
        setRoom(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadRoom();
  }, [roomId]);

  const nights = useMemo(
    () => calcNights(dates.checkIn, dates.checkOut),
    [dates.checkIn, dates.checkOut],
  );

  const servicesTotal = useMemo(() => {
    return Object.entries(selectedServices).reduce((total, [serviceId, quantity]) => {
      const svc = services.find((service) => service.id === serviceId);
      if (!svc) return total;
      return total + (svc.price ?? 0) * quantity;
    }, 0);
  }, [selectedServices, services]);

  const totalPrice = useMemo(() => {
    if (!room) return 0;
    return nights * Number(room.price ?? 0) + servicesTotal;
  }, [room, nights, servicesTotal]);

  const canProceedDates =
    !!dates.checkIn && !!dates.checkOut && nights > 0 && dates.guests > 0 && (!room || dates.guests <= room.capacity);

  const canProceedContact =
    contact.guestName.trim().length >= 2 &&
    contact.guestEmail.trim().length > 0 &&
    contact.guestPhone.trim().length >= 6;

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) => {
      const next = { ...prev };
      if (next[serviceId]) {
        delete next[serviceId];
      } else {
        next[serviceId] = 1;
      }
      return next;
    });
  };

  const handleQuantityChange = (serviceId, quantity) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceId]: Math.max(1, quantity),
    }));
  };

const handleCreateBooking = async () => {
  if (!room) return;
  const payload = {
    roomId: room.id,
    checkInDate: dates.checkIn,
      checkOutDate: dates.checkOut,
      numberOfGuests: dates.guests,
      guestName: contact.guestName,
      guestPhone: contact.guestPhone,
      guestEmail: contact.guestEmail,
      paymentMethod: 'ONLINE',
      additionalServices: Object.entries(selectedServices).map(([serviceId, quantity]) => ({
        serviceId,
        quantity,
      })),
      specialRequests: '',
    };

    const created = await bookingsService.create(payload);
    setBooking(created);
    return created;
  };

  const handlePayment = async () => {
    if (!booking) return;
    setPaying(true);
    try {
      const cardLast4Digits = card.number.replace(/\s+/g, '').slice(-4);
      const paymentPayload = {
        bookingId: booking.id,
        amount: totalPrice,
        method: 'ONLINE',
        cardLast4Digits,
      };
      const paymentResult = await paymentsService.create(paymentPayload);
      setPayment(paymentResult);
      setStep((prev) => prev + 1);
      refreshProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setPaying(false);
    }
  };

  const handleNext = async () => {
    if (step === 0 && !canProceedDates) return;
    if (step === 1 && !canProceedContact) return;

    if (step === 2 && !booking) {
      try {
        const created = await handleCreateBooking();
        if (!created) return;
      } catch (err) {
        setError(err.message);
        return;
      }
    }

    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  if (loading) {
    return (
      <AnimatedPage>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AnimatedPage>
    );
  }

  if (error && !room) {
    return (
      <AnimatedPage>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        </div>
      </AnimatedPage>
    );
  }

  if (!room) {
    return null;
  }

  return (
    <AnimatedPage>
      <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-10">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Бронирование номера: {room.name}</h1>
            <p className="text-gray-600">
              Цена {Number(room.price ?? 0).toLocaleString()} ₸ за ночь • вместимость {room.capacity} гостей
            </p>
          </header>

          <div className="flex items-center gap-4">
            {steps.map((label, index) => (
              <div key={label} className="flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      index === step
                        ? 'bg-blue-600 text-white'
                        : index < step
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">{error}</div>
          )}

          {step === 0 && (
            <section className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Выберите даты проживания</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Дата заезда
                  <input
                    type="date"
                    value={dates.checkIn}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(event) => setDates((prev) => ({ ...prev, checkIn: event.target.value }))}
                    className="border border-gray-300 rounded-lg px-4 py-2"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Дата выезда
                  <input
                    type="date"
                    value={dates.checkOut}
                    min={dates.checkIn || new Date().toISOString().slice(0, 10)}
                    onChange={(event) => setDates((prev) => ({ ...prev, checkOut: event.target.value }))}
                    className="border border-gray-300 rounded-lg px-4 py-2"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Количество гостей
                  <input
                    type="number"
                    value={dates.guests}
                    min={1}
                    max={room.capacity}
                    onChange={(event) =>
                      setDates((prev) => ({ ...prev, guests: Number(event.target.value) || 1 }))
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2"
                  />
                </label>
              </div>
              {nights > 0 && (
                <p className="text-gray-600">
                  Продолжительность проживания: <span className="font-semibold">{nights}</span> ночей
                </p>
              )}
            </section>
          )}

          {step === 1 && (
            <section className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Контактные данные гостя</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  ФИО
                  <input
                    type="text"
                    value={contact.guestName}
                    onChange={(event) =>
                      setContact((prev) => ({ ...prev, guestName: event.target.value }))
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="Иван Иванов"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Телефон
                  <input
                    type="tel"
                    value={contact.guestPhone}
                    onChange={(event) =>
                      setContact((prev) => ({ ...prev, guestPhone: event.target.value }))
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="+7 777 000 00 00"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                  Email
                  <input
                    type="email"
                    value={contact.guestEmail}
                    onChange={(event) =>
                      setContact((prev) => ({ ...prev, guestEmail: event.target.value }))
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="guest@example.com"
                  />
                </label>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Дополнительные услуги</h2>
              <p className="text-gray-600 text-sm">
                Выберите услуги, которые хотите добавить к бронированию. Стоимость будет включена в итоговую сумму.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => {
                  const isSelected = Boolean(selectedServices[service.id]);
                  return (
                    <div
                      key={service.id}
                      className={`border rounded-xl p-4 cursor-pointer transition ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                      }`}
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                        <span className="text-sm text-gray-500 uppercase">{service.category}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-semibold text-lg">
                          {Number(service.price ?? 0).toLocaleString()} ₸
                        </span>
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <button
                              className="px-2 py-1 border rounded"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleQuantityChange(service.id, (selectedServices[service.id] || 1) - 1);
                              }}
                            >
                              −
                            </button>
                            <span className="w-6 text-center font-semibold text-gray-700">
                              {selectedServices[service.id]}
                            </span>
                            <button
                              className="px-2 py-1 border rounded"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleQuantityChange(service.id, (selectedServices[service.id] || 1) + 1);
                              }}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Оплата</h2>
                    <p className="text-sm text-gray-600">
                      Введите данные карты. Это демонстрационная оплата — средства списаны не будут.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                      Номер карты
                      <input
                        type="text"
                        value={card.number}
                        onChange={(event) =>
                          setCard((prev) => ({ ...prev, number: event.target.value }))
                        }
                        placeholder="0000 0000 0000 0000"
                        className="border border-gray-300 rounded-lg px-4 py-2"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                        Срок действия
                        <input
                          type="text"
                          value={card.expiry}
                          onChange={(event) =>
                            setCard((prev) => ({ ...prev, expiry: event.target.value }))
                          }
                          placeholder="MM/YY"
                          className="border border-gray-300 rounded-lg px-4 py-2"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                        CVV
                        <input
                          type="password"
                          value={card.cvv}
                          onChange={(event) =>
                            setCard((prev) => ({ ...prev, cvv: event.target.value }))
                          }
                          placeholder="***"
                          className="border border-gray-300 rounded-lg px-4 py-2"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Итог</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Стоимость номера ({nights} ночей)</span>
                      <span>{(nights * Number(room.price ?? 0)).toLocaleString()} ₸</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Дополнительные услуги</span>
                      <span>{servicesTotal.toLocaleString()} ₸</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Итого к оплате</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {totalPrice.toLocaleString()} ₸
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="bg-white rounded-xl shadow-sm p-6 space-y-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Бронирование подтверждено!</h2>
              <p className="text-gray-600">
                Благодарим за оплату. Номер брони: <strong>{booking?.id}</strong>
              </p>
              <p className="text-gray-600">
                Детали оплаты отправлены на email <strong>{booking?.guestEmail}</strong>.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate('/profile/bookings')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Перейти к моим бронированиям
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
                >
                  На главную
                </button>
              </div>
            </section>
          )}

          {step < 4 && (
            <div className="flex justify-between">
              <button
                onClick={handlePrev}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-40"
                disabled={step === 0}
              >
                Назад
              </button>
              <button
                onClick={
                  step === 3
                    ? handlePayment
                    : handleNext
                }
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-40 flex items-center gap-2"
                disabled={
                  (step === 0 && !canProceedDates) ||
                  (step === 1 && !canProceedContact) ||
                  (step === 3 && (paying || card.number.length < 4))
                }
              >
                {step === 3 ? (paying ? 'Обработка...' : 'Оплатить') : 'Далее'}
              </button>
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default BookingProcess;
