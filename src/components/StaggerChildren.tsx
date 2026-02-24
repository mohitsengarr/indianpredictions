import { ReactNode, Children, cloneElement, isValidElement } from 'react';
import AnimateIn from './AnimateIn';

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
}

const StaggerChildren = ({
  children,
  className = '',
  staggerDelay = 0.06,
  baseDelay = 0,
  direction = 'up',
  distance = 16,
  duration = 0.45,
}: StaggerChildrenProps) => {
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, i) => (
        <AnimateIn
          key={i}
          delay={baseDelay + i * staggerDelay}
          direction={direction}
          distance={distance}
          duration={duration}
        >
          {child}
        </AnimateIn>
      ))}
    </div>
  );
};

export default StaggerChildren;
