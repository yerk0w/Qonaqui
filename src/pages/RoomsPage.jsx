import { useState } from 'react';
import RoomCard from '../components/RoomCard';
import Footer from '../components/Footer';
import AnimatedPage from '../components/AnimatedPage';
import RoomDetailModal from '../components/RoomDetailModal';
import { useRooms } from '../context/RoomsContext.jsx';

const RoomsPage = () => {
  const { rooms, isLoading, error } = useRooms();
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleOpenModal = (room) => {
    setSelectedRoom(room);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  return (
    <AnimatedPage>
      <>
        <div className="bg-white">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Наши Номера</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Выберите идеальный номер для вашего отдыха. Каждый номер оснащён всем необходимым для максимального комфорта и уюта.
              </p>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {error && !isLoading && (
              <p className="text-red-500 text-center mt-8">{error}</p>
            )}

            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 mt-12">
                {rooms.map((room) => (
                  <RoomCard key={room.id} room={room} onBookClick={handleOpenModal} />
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
        {selectedRoom && <RoomDetailModal room={selectedRoom} onClose={handleCloseModal} />}
      </>
    </AnimatedPage>
  );
};

export default RoomsPage;
