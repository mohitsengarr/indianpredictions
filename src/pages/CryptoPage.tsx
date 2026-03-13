import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSEO } from '@/hooks/useSEO';
import CryptoStatsBar from '@/components/crypto/CryptoStatsBar';
import CryptoTable from '@/components/crypto/CryptoTable';
import { CRYPTO_DATA } from '@/data/crypto-data';
import AnimateIn from '@/components/AnimateIn';

const CryptoPage = () => {
  const [showINR, setShowINR] = useState(true);

  useSEO({
    title: 'Cryptocurrency Prices, Charts & Market Cap | India Predictions',
    description: 'Live cryptocurrency prices in INR and USD. Track Bitcoin, Ethereum, Solana and 15+ cryptocurrencies with real-time market data, charts, and market cap rankings.',
    keywords: 'crypto price INR, bitcoin price india, ethereum price, cryptocurrency market cap, live crypto prices',
    canonical: '/crypto',
  });

  return (
    <div className="pb-24 lg:pb-8">
      <CryptoStatsBar />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
        <AnimateIn>
          <div className="flex items-center justify-between mb-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-xl lg:text-2xl font-extrabold text-gray-900"
              >
                Today's Cryptocurrency Prices
              </motion.h1>
              <p className="text-sm text-gray-500 mt-1">
                The global crypto market cap is <span className="font-semibold text-gray-700">$2.18T</span>,
                a <span className="text-[#EA3943] font-semibold">2.34%</span> decrease over the last day.
              </p>
            </div>

            {/* INR/USD Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setShowINR(false)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  !showINR ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                $ USD
              </button>
              <button
                onClick={() => setShowINR(true)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  showINR ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ₹ INR
              </button>
            </div>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
            <CryptoTable data={CRYPTO_DATA} showINR={showINR} />
          </div>
        </AnimateIn>
      </div>
    </div>
  );
};

export default CryptoPage;
