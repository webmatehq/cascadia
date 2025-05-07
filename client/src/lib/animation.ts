import { MotionProps } from 'framer-motion';

// Base animations for various elements
export const fadeIn = (delay: number = 0): MotionProps => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { 
    duration: 0.6, 
    delay,
    ease: 'easeInOut'
  }
});

export const slideUp = (delay: number = 0): MotionProps => ({
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { 
    duration: 0.6, 
    delay,
    ease: 'easeOut'
  }
});

export const slideIn = (direction: 'left' | 'right' = 'left', delay: number = 0): MotionProps => ({
  initial: { 
    opacity: 0, 
    x: direction === 'left' ? -50 : 50 
  },
  animate: { 
    opacity: 1, 
    x: 0 
  },
  transition: { 
    duration: 0.6, 
    delay,
    ease: 'easeOut'
  }
});

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export const scaleIn = (delay: number = 0): MotionProps => ({
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { 
    duration: 0.5, 
    delay,
    ease: 'easeOut'
  }
});
