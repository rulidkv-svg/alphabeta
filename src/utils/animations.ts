/**
 * Animation Variants & Utilities for LMS Alpha Beta
 * Principles: Smooth • Subtle • Fast • Professional • Accessible (prefers-reduced-motion)
 */

export const isReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Transition configurations
export const TRANSITIONS = {
  fast: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
  standard: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  smooth: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  spring: { type: 'spring', damping: 25, stiffness: 300 }
};

// Fade up animation
export const fadeUpVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: TRANSITIONS.standard
  },
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: TRANSITIONS.standard
  }
};

// Fade in simple
export const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: TRANSITIONS.fast
  },
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: TRANSITIONS.fast
  }
};

// Stagger container for lists & cards
export const staggerContainerVariant = (staggerChildren = 0.06, delayChildren = 0.02) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren
    }
  },
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02
    }
  },
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02
    }
  }
};

// Card hover effect (subtle lift + scale)
export const cardHoverVariant = {
  initial: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.01,
    transition: TRANSITIONS.fast
  },
  tap: {
    y: 0,
    scale: 0.99
  }
};

// Micro-interaction for buttons (press/tap)
export const buttonTapVariant = {
  hover: { scale: 1.02 },
  tap: { scale: 0.97 },
  transition: { duration: 0.1 }
};

// Modal entrance & exit
export const modalVariant = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: TRANSITIONS.standard
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 10,
    transition: TRANSITIONS.fast
  }
};

// Accordion collapse / expand
export const accordionVariant = {
  collapsed: { height: 0, opacity: 0 },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: TRANSITIONS.standard
  }
};

// RTL-aware slide-in variant
export const slideInDirectionVariant = (isRTL: boolean) => ({
  hidden: { opacity: 0, x: isRTL ? 24 : -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: TRANSITIONS.standard
  },
  exit: {
    opacity: 0,
    x: isRTL ? -24 : 24,
    transition: TRANSITIONS.fast
  }
});
