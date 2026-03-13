import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LivePriceCellProps {
  formattedPrice: string;
  rawPrice: number;
  isLive: boolean;
}

const LivePriceCell = ({ formattedPrice, rawPrice, isLive }: LivePriceCellProps) => {
  const prevPriceRef = useRef(rawPrice);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (!isLive) return;
    const prev = prevPriceRef.current;
    if (prev !== rawPrice && prev !== 0) {
      setFlash(rawPrice > prev ? 'up' : 'down');
      const timer = setTimeout(() => setFlash(null), 800);
      return () => clearTimeout(timer);
    }
    prevPriceRef.current = rawPrice;
  }, [rawPrice, isLive]);

  // Update ref after flash is set
  useEffect(() => {
    prevPriceRef.current = rawPrice;
  }, [rawPrice]);

  return (
    <span className="relative inline-block">
      <AnimatePresence>
        {flash && (
          <motion.span
            key={`flash-${Date.now()}`}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 rounded -mx-1 -my-0.5 px-1 py-0.5 ${
              flash === 'up'
                ? 'bg-[#16C784]/20 shadow-[0_0_8px_rgba(22,199,132,0.3)]'
                : 'bg-[#EA3943]/20 shadow-[0_0_8px_rgba(234,57,67,0.3)]'
            }`}
          />
        )}
      </AnimatePresence>
      <span
        className={`relative transition-colors duration-300 ${
          flash === 'up' ? 'text-[#16C784]' : flash === 'down' ? 'text-[#EA3943]' : ''
        }`}
      >
        {formattedPrice}
      </span>
    </span>
  );
};

export default LivePriceCell;
