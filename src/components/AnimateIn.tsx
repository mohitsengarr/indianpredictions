import { ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  scale?: boolean;
  blur?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

const AnimateIn = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 20,
  duration = 0.5,
  scale = false,
  blur = false,
  as: Tag = 'div',
}: AnimateInProps) => {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>();

  const getTransform = () => {
    if (!isVisible) {
      const transforms: string[] = [];
      switch (direction) {
        case 'up': transforms.push(`translateY(${distance}px)`); break;
        case 'down': transforms.push(`translateY(-${distance}px)`); break;
        case 'left': transforms.push(`translateX(${distance}px)`); break;
        case 'right': transforms.push(`translateX(-${distance}px)`); break;
      }
      if (scale) transforms.push('scale(0.96)');
      return transforms.join(' ') || 'none';
    }
    return 'translateY(0) translateX(0) scale(1)';
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        filter: blur && !isVisible ? 'blur(4px)' : 'blur(0px)',
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, filter ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

export default AnimateIn;
