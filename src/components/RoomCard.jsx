import { Star, Users, Wifi, Wind } from 'lucide-react';

const RoomCard = ({ room, onBookClick }) => {
  const coverImage = room.photos?.[0] ?? room.image;
  const rating = room.rating ?? 4.8;
  const reviewsCount = room.reviews?.length ?? 0;
  const capacity = room.capacity ?? room.guests ?? 1;
  const capacityLabel = capacity === 1 ? 'гость' : capacity < 5 ? 'гостя' : 'гостей';

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-shadow duration-300">
      <div className="md:w-1/3">
        <img
          src={coverImage}
          alt={room.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow w-full md:w-2/3">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{room.name}</h3>
          <p className="text-sm text-gray-500 uppercase tracking-wide mt-1">
            Этаж {room.floor} • {room.type}
          </p>
          <div className="flex items-center gap-2 text-yellow-500 my-2">
            <Star size={18} fill="currentColor" />
            <span className="font-bold text-gray-800">{rating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">
              ({reviewsCount} {reviewsCount === 1 ? 'отзыв' : 'отзывов'})
            </span>
          </div>
          <div className="flex items-center gap-4 text-gray-600 my-4 border-t border-b py-3">
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span>
                {capacity} {capacityLabel}
              </span>
            </div>
            {room.amenities?.includes('Wi-Fi') && (
              <div className="flex items-center gap-2">
                <Wifi size={20} />
                <span>Wi-Fi</span>
              </div>
            )}
            {room.amenities?.includes('Кондиционер') && (
              <div className="flex items-center gap-2">
                <Wind size={20} />
                <span>Кондиционер</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 line-clamp-3">{room.description}</p>
        </div>
        <div className="mt-auto flex justify-between items-center">
          <div>
            <p className="text-3xl font-extrabold text-blue-600">
              {Number(room.price ?? 0).toLocaleString()} ₸
            </p>
            <p className="text-gray-500">за ночь</p>
          </div>
          <button
            onClick={() => onBookClick(room)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-transform hover:scale-105 font-semibold text-lg"
          >
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
