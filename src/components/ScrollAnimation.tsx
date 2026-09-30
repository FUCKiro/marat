import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const MAX_DELAY = 0.3;

export default function ScrollAnimation({ children, className = '', delay = 0 }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: Math.min(delay, MAX_DELAY) }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
