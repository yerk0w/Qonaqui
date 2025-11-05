import { SlidersHorizontal } from 'lucide-react';

// Компонент теперь принимает текущие фильтры и функцию для их изменения
const FilterSidebar = ({ filters, onFilterChange }) => {

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    const currentAmenities = filters.amenities;

    let newAmenities;
    if (checked) {
      newAmenities = [...currentAmenities, name];
    } else {
      newAmenities = currentAmenities.filter(amenity => amenity !== name);
    }
    onFilterChange('amenities', newAmenities);
  };
  
  return (
    <aside className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-lg h-fit">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <SlidersHorizontal className="text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Фильтры</h3>
      </div>
      
      <div className="mb-6">
        <label htmlFor="price" className="font-semibold text-gray-700 block mb-2">Цена до: {filters.price.toLocaleString()} ₸</label>
        <input 
          type="range" id="price" min="20000" max="150000" step="5000"
          value={filters.price}
          onChange={(e) => onFilterChange('price', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
        />
      </div>

      <div className="mb-6">
        <label htmlFor="type" className="font-semibold text-gray-700 block mb-2">Тип номера</label>
        <select 
          id="type"
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="all">Все типы</option>
          <option value="Стандарт">Стандарт</option>
          <option value="Делюкс">Делюкс</option>
          <option value="Люкс">Люкс</option>
        </select>
      </div>

       <div className="mb-6">
        <label className="font-semibold text-gray-700 block mb-2">Удобства</label>
        <div className="space-y-2">
          <label className="flex items-center"><input type="checkbox" name="Wi-Fi" checked={filters.amenities.includes('Wi-Fi')} onChange={handleAmenityChange} className="h-4 w-4 rounded mr-2" /><span>Wi-Fi</span></label>
          <label className="flex items-center"><input type="checkbox" name="Кондиционер" checked={filters.amenities.includes('Кондиционер')} onChange={handleAmenityChange} className="h-4 w-4 rounded mr-2" /><span>Кондиционер</span></label>
          <label className="flex items-center"><input type="checkbox" name="Бассейн" checked={filters.amenities.includes('Бассейн')} onChange={handleAmenityChange} className="h-4 w-4 rounded mr-2" /><span>Бассейн</span></label>
          <label className="flex items-center"><input type="checkbox" name="Парковка" checked={filters.amenities.includes('Парковка')} onChange={handleAmenityChange} className="h-4 w-4 rounded mr-2" /><span>Парковка</span></label>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;