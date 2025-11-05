import { motion } from 'framer-motion';

// Определяем варианты анимации
const animations = {
  initial: { opacity: 0, y: 20 },   // Начальное состояние: прозрачный и сдвинут вниз
  animate: { opacity: 1, y: 0 },    // Конечное состояние: полностью видимый и на своем месте
  exit: { opacity: 0, y: -20 },   // Состояние при выходе: прозрачный и сдвинут вверх
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }} // Длительность анимации полсекунды
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;