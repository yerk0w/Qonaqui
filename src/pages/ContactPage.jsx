import Footer from '../components/Footer';
import { MapPin, Phone, Mail } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage'; // Импорт

const ContactPage = () => {
    return (
        <AnimatedPage>
            <>
                <div className="bg-white py-20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16"><h1 className="text-5xl font-extrabold text-gray-900">Свяжитесь с нами</h1><p className="text-lg text-gray-600 mt-4">Мы всегда рады ответить на ваши вопросы.</p></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                            <div><h2 className="text-3xl font-bold text-gray-800 mb-6">Контактная информация</h2><ul className="space-y-6 text-lg"><li className="flex items-center gap-4"><MapPin className="text-blue-600" size={24} /><span className="text-gray-700">г. Астана, ул. Достык, 1</span></li><li className="flex items-center gap-4"><Phone className="text-blue-600" size={24} /><span className="text-gray-700">+7 (7172) 12-34-56</span></li><li className="flex items-center gap-4"><Mail className="text-blue-600" size={24} /><span className="text-gray-700">booking@qonaqui.kz</span></li></ul><div className="mt-8 rounded-lg overflow-hidden shadow-lg"><img src="https://i.imgur.com/UYs1sSp.png" alt="Карта местоположения" className="w-full h-64 object-cover" /></div></div>
                            <div className="bg-gray-50 p-8 rounded-xl shadow-lg"><h2 className="text-3xl font-bold text-gray-800 mb-6">Отправить сообщение</h2><form className="space-y-6"><div><label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Ваше имя</label><input type="text" id="name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" /></div><div><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" id="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" /></div><div><label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Сообщение</label><textarea id="message" rows="5" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea></div><button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg">Отправить</button></form></div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        </AnimatedPage>
    );
};
export default ContactPage;