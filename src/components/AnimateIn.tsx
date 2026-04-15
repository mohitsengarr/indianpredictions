import { ReactNode, CSSProperties } from 'react';

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

/**
 * AnimateIn – CSS keyframe-based entrance animation.
 * Uses animation-fill-mode: both so content is always visible after the
 * animation completes. No JavaScript, no IntersectionObserver, no state.
 */
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
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const TagAny = Tag as any;
    return <TagAny className={className}>{children}</TagAny>;
  }

  const getTranslate = () => {
    switch (direction) {
      case 'up': return `translateY(${distance}px)`;
      case 'down': return `translateY(-${distance}px)`;
      case 'left': return `translateX(${distance}px)`;
      case 'right': return `translateX(-${distance}px)`;
      default: return 'none';
    }
  };

  const transforms: string[] = [];
  if (direction !== 'none') transforms.push(getTranslate());
  if (scale) transforms.push('scale(0.96)');
  const fromTransform = transforms.length ? transforms.join(' ') : 'none';

  const keyframeId = `anim-in-${direction}-${distance}-${scale ? 's' : ''}-${blur ? 'b' : ''}`;

  const style: CSSProperties = {
    animationName: keyframeId,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    animationFillMode: 'both',
    // Inline keyframe via CSS custom property trick — we use a <style> injection
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TagAny = Tag as any;

  return (
    <TagAny className={className} style={style}>
      <style>{`
        @keyframes ${keyframeId} {
          from {
            opacity: 0;
            transform: ${fromTransform};
            ${blur ? 'filter: blur(4px);' : ''}
          }
          to {
            opacity: 1;
            transform: none;
            ${blur ? 'filter: blur(0);' : ''}
          }
        }
      `}</style>
      {children}
    </TagAny>
  );
};

export default AnimateIn;
