import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { bookingsService } from '../services/bookingsService';
import { useAuth } from './AuthContext.jsx';

const BookingsContext = createContext(null);

export const BookingsProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMyBookings = useCallback(async () => {
    if (!isAuthenticated) {
      setBookings([]);
      return;
    }
    setIsLoading(true);
    try {
      const payload = await bookingsService.listMy();
      setBookings(payload);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const createBooking = useCallback(async (data) => {
    const booking = await bookingsService.create(data);
    await loadMyBookings();
    return booking;
  }, [loadMyBookings]);

  const updateStatus = useCallback(async (id, payload) => {
    const updated = await bookingsService.updateStatus(id, payload);
    await loadMyBookings();
    return updated;
  }, [loadMyBookings]);

  const value = useMemo(() => ({
    bookings,
    isLoading,
    error,
    loadMyBookings,
    createBooking,
    updateStatus,
  }), [bookings, isLoading, error, loadMyBookings, createBooking, updateStatus]);

  useEffect(() => {
    loadMyBookings();
  }, [loadMyBookings]);

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error('useBookings должен использоваться внутри BookingsProvider');
  }
  return context;
};
