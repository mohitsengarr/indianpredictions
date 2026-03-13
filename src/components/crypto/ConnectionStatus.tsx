import { useEffect, useState } from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
  lastUpdate: Date | null;
}

const ConnectionStatus = ({ isConnected, lastUpdate }: ConnectionStatusProps) => {
  const [secondsAgo, setSecondsAgo] = useState<number | null>(null);

  useEffect(() => {
    if (!lastUpdate) return;
    const update = () => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdate.getTime()) / 1000));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="relative flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          {isConnected && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16C784] opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isConnected ? 'bg-[#16C784]' : 'bg-[#EA3943]'
            }`}
          />
        </span>
        <span className={`font-medium ${isConnected ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
          {isConnected ? 'Live' : 'Reconnecting...'}
        </span>
      </span>
      {secondsAgo !== null && isConnected && (
        <span className="text-gray-400">
          Updated {secondsAgo === 0 ? 'just now' : `${secondsAgo}s ago`}
        </span>
      )}
    </div>
  );
};

export default ConnectionStatus;
