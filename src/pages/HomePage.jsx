import { Link } from 'react-router-dom';
import { Calendar, User, Search, ArrowDown, Wifi, Coffee, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import HeroBg from '../assets/hero-background.jpg';
import Footer from '../components/Footer';
import AnimatedPage from '../components/AnimatedPage';

const featuredRooms = [
  {
    name: "Королевский Люкс",
    description: "Просторный номер с панорамным видом на город.",
    image:
      "https://lottehotelmoscow.ru/upload/resize_cache/iblock/b06/768_480_2619711fa078991f0a23d032687646b21/0z799562mcg44qby9tue39tjc80eugod.jpg",
  },
  {
    name: "Семейный Делюкс",
    description: "Идеальный выбор для семейного отдыха, с двумя комнатами.",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Стандарт Комфорт",
    description: "Уютный и современный номер для работы и отдыха.",
    image:
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop",
  },
];

const HomePage = () => {
  const { t } = useTranslation();

  const scrollToContent = () => {
    document.getElementById('content-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatedPage>
      <>
        <div 
          className="h-screen bg-cover bg-center flex items-center justify-center text-white relative" 
          style={{ backgroundImage: `url(${HeroBg})` }}
        >
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          <div className="relative z-10 text-center flex flex-col items-center p-4">

            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-2xl">{t('home.title')}</h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl drop-shadow-lg">{t('home.subtitle')}</p>
          </div>
          
          <button 
            onClick={scrollToContent} 
            className="absolute bottom-10 animate-bounce bg-white/20 p-3 rounded-full"
          >
            <ArrowDown size={28} />
          </button>
        </div>

        <div id="content-section" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Наши лучшие номера</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Мы отобрали для вас самые популярные варианты, которые сочетают в себе комфорт и стиль.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredRooms.map((room, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden group">
                  <div className="overflow-hidden h-64">
                      <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{room.name}</h3>
                    <p className="text-gray-600">{room.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-24">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Почему выбирают нас</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
                  <div className="flex flex-col items-center">
                      <div className="bg-blue-100 p-5 rounded-full mb-4"><Award size={32} className="text-blue-600" /></div>
                      <h3 className="text-xl font-bold mb-2">Высокий сервис</h3>
                      <p className="text-gray-600">Наша команда заботится о каждой детали.</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <div className="bg-blue-100 p-5 rounded-full mb-4"><Wifi size={32} className="text-blue-600" /></div>
                      <h3 className="text-xl font-bold mb-2">Бесплатный Wi-Fi</h3>
                      <p className="text-gray-600">Оставайтесь на связи в любой точке отеля.</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <div className="bg-blue-100 p-5 rounded-full mb-4"><Coffee size={32} className="text-blue-600" /></div>
                      <h3 className="text-xl font-bold mb-2">Вкусные завтраки</h3>
                      <p className="text-gray-600">Начните день с разнообразия блюд.</p>
                  </div>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </>
    </AnimatedPage>
  );
};

export default HomePage;