import Footer from '../components/Footer';
import { ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage'; // Импорт

const AboutPage = () => {
  return (
    <AnimatedPage>
      <>
        <div className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-extrabold text-gray-900">Наша История</h1>
              <p className="text-lg text-gray-600 mt-4">Больше, чем просто отель. Мы — место, где создаются воспоминания.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="rounded-lg overflow-hidden shadow-2xl"><img src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1932&auto=format&fit=crop" alt="Hotel Lobby" className="w-full h-full object-cover"/></div>
              <div className="text-gray-700 text-lg leading-relaxed"><h2 className="text-3xl font-bold text-gray-800 mb-4">Добро пожаловать в QonaqUi!</h2><p className="mb-4">Наш отель был основан в 2015 году с одной простой целью: предоставить гостям столицы исключительный уровень сервиса и комфорта. Мы верим, что гостеприимство — это искусство.</p><p>Мы гордимся нашим наследием и постоянно стремимся к совершенству, чтобы ваше пребывание у нас было не просто поездкой, а настоящим событием.</p></div>
            </div>
            <div className="text-center mt-24"><h2 className="text-4xl font-bold text-gray-800 mb-12">Наши ценности</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-12"><div className="flex flex-col items-center"><div className="bg-blue-100 p-5 rounded-full mb-4"><HeartHandshake size={32} className="text-blue-600" /></div><h3 className="text-xl font-bold mb-2">Гостеприимство</h3><p className="text-gray-600">Мы относимся к каждому гостю как к члену семьи.</p></div><div className="flex flex-col items-center"><div className="bg-blue-100 p-5 rounded-full mb-4"><ShieldCheck size={32} className="text-blue-600" /></div><h3 className="text-xl font-bold mb-2">Качество и безопасность</h3><p className="text-gray-600">Ваш комфорт и безопасность — наш главный приоритет.</p></div><div className="flex flex-col items-center"><div className="bg-blue-100 p-5 rounded-full mb-4"><Sparkles size={32} className="text-blue-600" /></div><h3 className="text-xl font-bold mb-2">Внимание к деталям</h3><p className="text-gray-600">Именно мелочи создают незабываемые впечатления.</p></div></div></div>
          </div>
        </div>
        <Footer />
      </>
    </AnimatedPage>
  );
};
export default AboutPage;