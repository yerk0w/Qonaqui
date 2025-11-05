import { useState } from 'react'; // <-- 1. Импортируем useState
import RoomCard from '../components/RoomCard';
import Footer from '../components/Footer';
import AnimatedPage from '../components/AnimatedPage';
import RoomDetailModal from '../components/RoomDetailModal'; // <-- 2. Импортируем модальное окно

// Данные номеров (оставим без изменений)
const allRooms = [
    { id: 1, name: 'Стандарт с видом на город', price: 25000, type: 'Стандарт', rating: 4.5, guests: 2, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop', amenities: ['Wi-Fi', 'Кондиционер'], description: 'Уютный стандартный номер с прекрасным видом на городские огни. Идеально подходит для деловых поездок и коротких остановок. В номере есть все необходимое для комфортного пребывания.', reviews: [{author: 'Айгерим', comment: 'Чисто и уютно!'}, {author: 'Марат', comment: 'Отличный вид из окна.'}]},
    { id: 2, name: 'Делюкс с балконом', price: 40000, type: 'Делюкс', rating: 4.8, guests: 2, image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop', amenities: ['Wi-Fi', 'Кондиционер', 'Парковка'], description: 'Просторный номер Делюкс с собственным балконом, где можно насладиться утренним кофе. Улучшенный дизайн и дополнительные удобства сделают ваш отдых незабываемым.', reviews: [{author: 'Елена', comment: 'Балкон - это супер!'}, {author: 'Алексей', comment: 'Очень просторно.'}]},
    { id: 3, name: 'Семейный Люкс', price: 65000, type: 'Люкс', rating: 4.9, guests: 4, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop', amenities: ['Wi-Fi', 'Кондиционер', 'Парковка', 'Бассейн'], description: 'Роскошный двухкомнатный люкс, идеально подходящий для семейного отдыха. Включает в себя гостиную зону, большую ванную комнату и доступ к эксклюзивным услугам отеля.', reviews: [{author: 'Семья Ивановых', comment: 'Детям очень понравилось!'}, {author: 'Ольга', comment: 'Стоит своих денег.'}]},
    { id: 4, name: 'Улучшенный Стандарт', price: 30000, type: 'Стандарт', rating: 4.6, guests: 2, image: 'https://images.unsplash.com/photo-1590490359854-dfba59ee83c8?auto=format&fit=crop', amenities: ['Wi-Fi', 'Кондиционер'], description: 'Номер с увеличенной площадью и улучшенной отделкой. Отличный выбор для тех, кто ценит дополнительный комфорт по разумной цене.', reviews: [{author: 'Виктор', comment: 'Больше, чем я ожидал.'}]},
    { id: 5, name: 'Люкс с джакузи', price: 90000, type: 'Люкс', rating: 5.0, guests: 2, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop', amenities: ['Wi-Fi', 'Кондиционер', 'Парковка', 'Бассейн', 'Ресторан'], description: 'Эксклюзивный номер для особого случая. Главная особенность - большое джакузи прямо в номере. Идеально для романтического уикенда.', reviews: [{author: 'Анна и Денис', comment: 'Незабываемо! Просто восторг!'}]},
    { id: 6, name: 'Номер для новобрачных', price: 75000, type: 'Делюкс', rating: 4.9, guests: 2, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop', amenities: ['Wi-Fi', 'Кондиционер', 'Парковка'], description: 'Создайте незабываемые воспоминания в нашем номере для новобрачных, который отличается романтическим декором и специальными удобствами.', reviews: [{author: 'Алия', comment: 'Идеальное место для медового месяца.'}]}
];

const RoomsPage = () => {
    // 3. Управление состоянием для модального окна
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
                                Выберите идеальный номер для вашего отдыха. Каждый номер оснащен всем необходимым для максимального комфорта и уюта.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 mt-12">
                            {allRooms.map(room => (
                                // 4. Передаем функцию в RoomCard
                                <RoomCard key={room.id} room={room} onBookClick={handleOpenModal} />
                            ))}
                        </div>
                    </div>
                </div>
                <Footer />

                {/* 5. Рендерим модальное окно, если комната выбрана */}
                {selectedRoom && <RoomDetailModal room={selectedRoom} onClose={handleCloseModal} />}
            </>
        </AnimatedPage>
    );
}

export default RoomsPage;