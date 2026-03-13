import { useState } from 'react';
import { motion } from 'framer-motion';
import { CRYPTO_DATA } from '@/data/crypto-data';
import CryptoStatsBar from '@/components/crypto/CryptoStatsBar';
import CryptoTable from '@/components/crypto/CryptoTable';
import { useSEO } from '@/hooks/useSEO';
import { useBinanceWebSocket } from '@/hooks/useBinanceWebSocket';

const CryptoPage = () => {
  const [showINR, setShowINR] = useState(true);
  const { prices, isConnected, lastUpdate } = useBinanceWebSocket();

  useSEO({
    title: 'Cryptocurrency Prices, Charts & Market Cap | India Predictions',
    description: 'Live cryptocurrency prices in INR & USD. Track Bitcoin, Ethereum, BNB and 15+ top cryptos with real-time market data, charts and Fear & Greed index.',
    keywords: 'crypto prices India, Bitcoin price INR, Ethereum INR, cryptocurrency market cap, crypto India',
    canonical: '/crypto',
  });

  return (
    <div className="pb-24 lg:pb-8 bg-white min-h-screen">
      {/* Global Stats Bar */}
      <CryptoStatsBar showINR={showINR} livePrices={prices} isConnected={isConnected} />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Today's Cryptocurrency Prices
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              The global crypto market cap is <span className="font-semibold text-gray-700">$2.21T</span>, a{' '}
              <span className="text-[#EA3943] font-semibold">1.42%</span> decrease over the last day.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setShowINR(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                !showINR ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              $ USD
            </button>
            <button
              onClick={() => setShowINR(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                showINR ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ₹ INR
            </button>
          </div>
        </motion.div>

        {/* Main Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <CryptoTable
            data={CRYPTO_DATA}
            showINR={showINR}
            livePrices={prices}
            isConnected={isConnected}
            lastUpdate={lastUpdate}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CryptoPage;
