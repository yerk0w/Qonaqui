import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { roomsService } from '../services/roomsService';

const RoomsContext = createContext(null);

const normalizeRoom = (room) => {
  const number = room.number ?? room.id;
  return {
    id: room.id,
    number,
    name: room.name ?? `Номер ${number}`,
    type: room.type,
    floor: room.floor,
    capacity: room.capacity,
    price: Number(room.price ?? 0),
    area: room.area,
    bedType: room.bedType,
    amenities: room.amenities ?? [],
    photos: room.photos ?? [],
    description: room.description ?? '',
    status: room.status,
    coordinates: room.coordinates,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    rating: room.rating ?? 4.8,
    reviews: room.reviews ?? [],
    image: room.image,
  };
};

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRooms = useCallback(async (overrides = {}) => {
    setIsLoading(true);
    try {
      const payload = await roomsService.list({ ...filters, ...overrides });
      setRooms(payload.map(normalizeRoom));
      setError(null);
    } catch (err) {
      setError(err.message);
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const value = useMemo(() => ({
    rooms,
    filters,
    setFilters,
    isLoading,
    error,
    refresh: fetchRooms,
  }), [rooms, filters, isLoading, error, fetchRooms]);

  return (
    <RoomsContext.Provider value={value}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error('useRooms должен использоваться внутри RoomsProvider');
  }
  return context;
};
