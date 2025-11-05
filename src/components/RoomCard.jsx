import { Star, Users, Wifi, Wind } from 'lucide-react';

// Компонент теперь принимает функцию onBookClick
const RoomCard = ({ room, onBookClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-shadow duration-300">
      <div className="md:w-1/3">
        <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-6 flex flex-col flex-grow w-full md:w-2/3">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{room.name}</h3>
          <div className="flex items-center gap-2 text-yellow-500 my-2">
            <Star size={18} fill="currentColor" />
            <span className="font-bold text-gray-800">{room.rating}</span>
            <span className="text-gray-500 text-sm">({room.reviews.length} отзыва)</span>
          </div>
          <div className="flex items-center gap-4 text-gray-600 my-4 border-t border-b py-3">
            <div className="flex items-center gap-2"><Users size={20} /><span>{room.guests} гостя</span></div>
            {room.amenities.includes('Wi-Fi') && <div className="flex items-center gap-2"><Wifi size={20} /><span>Wi-Fi</span></div>}
            {room.amenities.includes('Кондиционер') && <div className="flex items-center gap-2"><Wind size={20} /><span>Кондиционер</span></div>}
          </div>
        </div>
        <div className="mt-auto flex justify-between items-center">
          <div>
            <p className="text-3xl font-extrabold text-blue-600">{room.price.toLocaleString()} ₸</p>
            <p className="text-gray-500">за ночь</p>
          </div>
          {/* Эта кнопка теперь открывает модальное окно */}
          <button onClick={() => onBookClick(room)} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-transform hover:scale-105 font-semibold text-lg">
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;