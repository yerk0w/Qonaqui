import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Star, Wifi, Wind, ParkingCircle, Droplets, UtensilsCrossed } from 'lucide-react';

const RoomDetailModal = ({ room, onClose }) => {
  const navigate = useNavigate();

  // 
  // ВОТ ИСПРАВЛЕНИЕ:
  // Мы больше не используем "isLoggedIn", а напрямую проверяем наличие токена.
  //
  const token = localStorage.getItem('token'); 

  if (!room) return null;

  const handleBookingClick = () => {
    // Проверяем наличие токена здесь
    if (token) {
      alert(`Номер "${room.name}" успешно забронирован!`);
      onClose();
    } else {
      // Если токена нет, перенаправляем на страницу входа
      navigate('/login');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{room.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto p-6">
            <div className="grid grid-cols-3 gap-2 mb-6">
              <img src={room.image} alt={room.name} className="col-span-3 h-80 w-full object-cover rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Описание</h3>
                <p className="text-gray-600 leading-relaxed">{room.description}</p>
                <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">Удобства</h3>
                <div className="flex flex-wrap gap-4 text-gray-700">
                    {room.amenities.map(amenity => (
                        <span key={amenity} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                            {amenity === 'Wi-Fi' && <Wifi size={16}/>}
                            {amenity === 'Кондиционер' && <Wind size={16}/>}
                            {amenity === 'Парковка' && <ParkingCircle size={16}/>}
                            {amenity === 'Бассейн' && <Droplets size={16}/>}
                            {amenity === 'Ресторан' && <UtensilsCrossed size={16}/>}
                            {amenity}
                        </span>
                    ))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Отзывы</h3>
                 <div className="flex items-center gap-2 text-yellow-500 mb-4">
                    <Star size={20} fill="currentColor" />
                    <span className="font-bold text-xl text-gray-800">{room.rating}</span>
                    <span className="text-gray-500 text-sm">/ 5.0</span>
                </div>
                {room.reviews.map((review, index) => (
                    <div key={index} className="border-t pt-2 mt-2">
                        <p className="font-semibold text-gray-700">{review.author}</p>
                        <p className="text-sm text-gray-500">"{review.comment}"</p>
                    </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t mt-auto flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{room.price.toLocaleString()} ₸</p>
              <p className="text-gray-500 text-sm">за ночь</p>
            </div>
            <button onClick={handleBookingClick} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-transform hover:scale-105 font-semibold text-lg">
              Забронировать сейчас
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RoomDetailModal;