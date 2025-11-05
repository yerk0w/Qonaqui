import { useState, useEffect } from 'react';
import FilterSidebar from '../components/FilterSidebar';
import RoomCard from '../components/RoomCard';
import AnimatedPage from '../components/AnimatedPage';
import RoomDetailModal from '../components/RoomDetailModal';

const allRoomsData = [
  { id: 1, name: 'Стандарт с видом на город', price: 25000, type: 'Стандарт', rating: 4.5, guests: 2, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop', amenities: ['Wi-Fi', 'Кондиционер'], description: 'Уютный стандартный номер с прекрасным видом на городские огни. Идеально подходит для деловых поездок и коротких остановок. В номере есть все необходимое для комфортного пребывания.', reviews: [{author: 'Айгерим', comment: 'Чисто и уютно!'}, {author: 'Марат', comment: 'Отличный вид из окна.'}]},
  { id: 2, name: 'Делюкс с балконом', price: 40000, type: 'Делюкс', rating: 4.8, guests: 2, image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop', amenities: ['Wi-Fi', 'Кондиционер', 'Парковка'], description: 'Просторный номер Делюкс с собственным балконом, где можно насладиться утренним кофе. Улучшенный дизайн и дополнительные удобства сделают ваш отдых незабываемым.', reviews: [{author: 'Елена', comment: 'Балкон - это супер!'}, {author: 'Алексей', comment: 'Очень просторно.'}]},
  { id: 3, name: 'Семейный Люкс', price: 65000, type: 'Люкс', rating: 4.9, guests: 4, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop', amenities: ['Wi-Fi', 'Кондиционер', 'Парковка', 'Бассейн'], description: 'Роскошный двухкомнатный люкс, идеально подходящий для семейного отдыха. Включает в себя гостиную зону, большую ванную комнату и доступ к эксклюзивным услугам отеля.', reviews: [{author: 'Семья Ивановых', comment: 'Детям очень понравилось!'}, {author: 'Ольга', comment: 'Стоит своих денег.'}]},
  { id: 4, name: 'Улучшенный Стандарт', price: 30000, type: 'Стандарт', rating: 4.6, guests: 2, image: 'https://images.unsplash.com/photo-1590490359854-dfba59ee83c8?auto=format&fit=crop', amenities: ['Wi-Fi', 'Кондиционер'], description: 'Номер с увеличенной площадью и улучшенной отделкой. Отличный выбор для тех, кто ценит дополнительный комфорт по разумной цене.', reviews: [{author: 'Виктор', comment: 'Больше, чем я ожидал.'}]},
  { id: 5, name: 'Люкс с джакузи', price: 90000, type: 'Люкс', rating: 5.0, guests: 2, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop', amenities: ['Wi-Fi', 'Кондиционер', 'Парковка', 'Бассейн', 'Ресторан'], description: 'Эксклюзивный номер для особого случая. Главная особенность - большое джакузи прямо в номере. Идеально для романтического уикенда.', reviews: [{author: 'Анна и Денис', comment: 'Незабываемо! Просто восторг!'}]},
];

const ResultsPage = () => {
  const [filters, setFilters] = useState({
    price: 150000,
    type: 'all',
    amenities: []
  });
  const [filteredRooms, setFilteredRooms] = useState(allRoomsData);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    let result = allRoomsData
      .filter(room => room.price <= filters.price)
      .filter(room => filters.type === 'all' || room.type === filters.type)
      .filter(room => filters.amenities.every(amenity => room.amenities.includes(amenity)));
    
    setFilteredRooms(result);
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };
  
  const handleOpenModal = (room) => {
    setSelectedRoom(room);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  return (
    <AnimatedPage>
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
            <div className="w-full md:w-3/4">
                <div className="bg-white p-4 rounded-xl shadow-lg mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Найдено: {filteredRooms.length} {filteredRooms.length === 1 ? 'номер' : (filteredRooms.length > 1 && filteredRooms.length < 5) ? 'номера' : 'номеров'}
                    </h2>
                </div>
                <div className="space-y-6">
                    {filteredRooms.length > 0 ? (
                      filteredRooms.map(room => (
                        <RoomCard key={room.id} room={room} onBookClick={handleOpenModal} />
                      ))
                    ) : (
                      <div className="text-center bg-white p-10 rounded-lg shadow-md">
                        <h3 className="text-2xl font-bold text-gray-700">Номера не найдены</h3>
                        <p className="text-gray-500 mt-2">Попробуйте изменить параметры фильтра.</p>
                      </div>
                    )}
                </div>
            </div>
        </div>
        {selectedRoom && <RoomDetailModal room={selectedRoom} onClose={handleCloseModal} />}
    </AnimatedPage>
  );
};
export default ResultsPage;