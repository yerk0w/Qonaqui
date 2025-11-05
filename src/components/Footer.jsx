import { useTranslation } from 'react-i18next';
import { Hotel, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div><div className="flex items-center gap-2 mb-4"><Hotel size={28} /><span className="text-2xl font-bold tracking-tight">QonaqUi</span></div><p className="text-gray-400">Ваш идеальный отдых в лучшем отеле города.</p></div>
          <div><h3 className="text-lg font-semibold mb-4">{t('footer.nav')}</h3><ul className="space-y-2"><li><a href="#" className="text-gray-400 hover:text-white transition">Номера</a></li><li><a href="#" className="text-gray-400 hover:text-white transition">Ресторан</a></li></ul></div>
          <div><h3 className="text-lg font-semibold mb-4">{t('footer.contacts')}</h3><ul className="space-y-3 text-gray-400"><li className="flex items-center gap-3"><MapPin size={18} /><span>г. Астана, ул. Достык, 1</span></li><li className="flex items-center gap-3"><Phone size={18} /><span>+7 (7172) 12-34-56</span></li><li className="flex items-center gap-3"><Mail size={18} /><span>booking@qonaqui.kz</span></li></ul></div>
          <div><h3 className="text-lg font-semibold mb-4">{t('footer.offers')}</h3><p className="text-gray-400 mb-4">{t('footer.subscribe')}</p><div className="flex"><input type="email" placeholder="Ваш Email" className="w-full rounded-l-lg p-2 text-gray-800 focus:outline-none" /><button className="bg-blue-600 px-4 rounded-r-lg hover:bg-blue-700 transition">Go</button></div></div>
        </div>
        <div className="border-t border-gray-700 pt-6 mt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">{t('footer.copyright', { year: currentYear })}</p>
          <div className="flex gap-4 text-gray-500 text-sm"><a href="#" className="hover:text-white transition">{t('footer.privacy')}</a><a href="#" className="hover:text-white transition">{t('footer.terms')}</a></div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;