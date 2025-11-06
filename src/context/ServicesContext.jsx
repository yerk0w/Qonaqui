import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { servicesService } from '../services/servicesService';

const ServicesContext = createContext(null);

export const ServicesProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async (nextCategory = category) => {
    setIsLoading(true);
    try {
      const payload = await servicesService.list(nextCategory);
      setServices(payload);
      setError(null);
    } catch (err) {
      setError(err.message);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const value = useMemo(() => ({
    services,
    category,
    setCategory,
    isLoading,
    error,
    refresh: fetchServices,
  }), [services, category, isLoading, error, fetchServices]);

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices должен использоваться внутри ServicesProvider');
  }
  return context;
};
