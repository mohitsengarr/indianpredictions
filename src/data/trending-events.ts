export type EventCategory =
  | 'markets'
  | 'economy'
  | 'politics'
  | 'sports'
  | 'geopolitics'
  | 'technology'
  | 'entertainment'
  | 'regulation';

export type EventStatus = 'active' | 'critical' | 'upcoming' | 'completed';

export interface TrendingEvent {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  status: EventStatus;
  summary: string;
  keyDrivers?: string[];
  keyDataPoints?: { label: string; value: string }[];
  keyDetails?: string[];
  keyTrends?: string[];
  keyReleases?: string[];
  keyBattles?: { state: string; detail: string }[];
  impactOnIndia?: string[];
  mckinseyAnalysis: string[];
  impactProbability?: string;
  predictionMarketAngle: string;
  categoryLabel: string;
  categoryEmoji: string;
  updatedAt: string;
}

export const TRENDING_EVENTS: TrendingEvent[] = [
  {
    id: 'evt-1',
    slug: 'stock-market-crash-fearful-friday',
    title: 'Stock Market Crash – "Fearful Friday"',
    category: 'markets',
    status: 'critical',
    summary:
      'Nifty plunges 5% for the week (biggest weekly fall in 4 years). Sensex and Nifty tumble nearly 2% as crude oil surges past $101. Frontline indices 11-13% below record highs. Rupee hits fresh all-time low.',
    keyDrivers: [
      'West Asia / Middle East tensions (US & Israel airstrikes on Iran)',
      'Surging crude oil prices past $101/barrel',
      'FII outflows accelerating',
    ],
    mckinseyAnalysis: [
      'Market breadth narrowly negative with weakness in tech and oil stocks',
      'India VIX surged ~100% over past month, fell 15% to 19.80 on relief rally',
      'Structural selloff: 7% Sensex decline since Sept-end 2024 masks sharper correction beneath surface',
      'Metal, auto, midcap stocks leading the decline',
      'LPG gas shortage across India due to Middle East tensions',
    ],
    impactProbability: 'High – sustained geopolitical uncertainty',
    predictionMarketAngle: 'Will Nifty recover above 24,000 by end of March 2026?',
    categoryLabel: 'Markets',
    categoryEmoji: '📉',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-2',
    slug: 'rbi-monetary-policy-rates-on-hold',
    title: 'RBI Monetary Policy – Rates on Hold',
    category: 'economy',
    status: 'active',
    summary:
      'RBI maintained repo rate at 5.25% in Feb 2026 meeting. Neutral stance maintained. 80% of economists expect rates steady through 2026.',
    keyDataPoints: [
      { label: 'GDP Growth FY26', value: '7.4%' },
      { label: 'GDP Growth FY27 Forecast', value: '6.8-7.2%' },
      { label: 'Inflation FY26', value: '2.1%' },
      { label: 'Projected Inflation 2026', value: '3.9%' },
      { label: 'Goldman Sachs 2026 Forecast', value: '6.9% growth' },
    ],
    mckinseyAnalysis: [
      'India remains fastest-growing major economy for 4th consecutive year',
      'Private consumption growth expected to rise to 7.7% YoY in 2026',
      'US-India trade deal lowering uncertainty',
      'India-EU FTA progress adding confidence',
      'Rising oil prices could complicate inflation outlook',
    ],
    predictionMarketAngle: 'Will RBI cut rates before June 2026?',
    categoryLabel: 'Economy',
    categoryEmoji: '🏦',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-3',
    slug: 'us-india-trade-deal-impact',
    title: 'US-India Trade Deal Impact',
    category: 'economy',
    status: 'active',
    summary:
      'New US-India trade deal expected to lower trade uncertainty. Goldman Sachs estimates 0.2pp GDP growth boost.',
    mckinseyAnalysis: [
      'India\'s exporters faced the steepest tariff barriers among APAC nations in 2025',
      'Deal expected to unlock India\'s private investment cycle and boost manufacturing',
      'Combined with easier financial conditions = structural tailwind',
    ],
    predictionMarketAngle: 'Will the US-India trade deal boost Indian exports by 10%+ in FY27?',
    categoryLabel: 'Economy',
    categoryEmoji: '🤝',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-4',
    slug: 'gold-silver-rally',
    title: 'Gold & Silver Rally',
    category: 'markets',
    status: 'active',
    summary:
      'Gold approaching ₹1,63,500-1,65,000 ($5,250-5,300). Silver targeting ₹2,85,000 ($95). Central bank buying (China added gold for 16th month straight).',
    mckinseyAnalysis: [
      'Safe-haven demand vs USD strength creating push-pull',
      'Structural central bank buying providing floor',
      'Geopolitical premium embedded in current prices',
    ],
    predictionMarketAngle: 'Will gold cross $5,500 by Q2 2026?',
    categoryLabel: 'Commodities',
    categoryEmoji: '🥇',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-5',
    slug: '2026-state-assembly-elections',
    title: '2026 State Assembly Elections (5 States + 1 UT)',
    category: 'politics',
    status: 'upcoming',
    summary:
      'Assembly elections in Kerala, Tamil Nadu, Assam, West Bengal, and Puducherry. Rajya Sabha elections for 37 seats on March 16, 2026.',
    keyBattles: [
      { state: 'Kerala', detail: 'LDF vs UDF vs BJP (BJP won Thiruvananthapuram Municipal Corp – first time)' },
      { state: 'Tamil Nadu', detail: 'DMK vs AIADMK vs TVK (Actor Vijay\'s new party). DMK targeting 2.5 crore votes.' },
      { state: 'Assam', detail: 'BJP (Himanta Biswa Sarma) vs Congress. NRC/CAA still explosive issue.' },
      { state: 'West Bengal', detail: 'TMC (Mamata) vs BJP. TMC going solo, unconcerned with opposition unity.' },
      { state: 'Puducherry', detail: 'AINRC vs Congress vs BJP. 30-member assembly.' },
    ],
    mckinseyAnalysis: [
      'BJP largest party in Rajya Sabha but short of majority',
      'NDA far from 2/3rds needed for constitutional amendments',
      'These elections directly shape upper house composition',
      'Identity politics, language issues, center-state relations at play',
      'Incumbency being tested across multiple states',
    ],
    predictionMarketAngle: 'Will BJP win 3+ out of 5 state elections?',
    categoryLabel: 'Politics',
    categoryEmoji: '🗳️',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-6',
    slug: 'rajya-sabha-elections',
    title: 'Rajya Sabha Elections – March 16',
    category: 'politics',
    status: 'upcoming',
    summary: '37 Rajya Sabha seats up for election. Key political heavyweights\' terms ending.',
    mckinseyAnalysis: [
      'Outcome shapes NDA\'s upper house strength',
      'Critical for legislative agenda and constitutional amendment feasibility',
    ],
    predictionMarketAngle: 'Will NDA gain Rajya Sabha majority after March 2026 elections?',
    categoryLabel: 'Politics',
    categoryEmoji: '🏛️',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-7',
    slug: 'ipl-2026-season',
    title: 'IPL 2026 Season',
    category: 'sports',
    status: 'upcoming',
    summary:
      'IPL 2026 first phase: 20 matches across 10 venues. RCB defending champions. Schedule may be impacted by West Asia crisis and state elections.',
    keyDetails: [
      'Opening match: RCB vs SRH at M Chinnaswamy Stadium (March 28)',
      'Mumbai Indians vs KKR at Wankhede (March 29)',
      '4 double-headers scheduled',
      'BCCI coordinating with Election Commission on full schedule',
      'West Asia conflict causing LPG shortage may delay start',
    ],
    mckinseyAnalysis: [
      'IPL economic impact: billions in advertising, media rights',
      'Geopolitical risk to scheduling unprecedented',
      'Split-phase format reflects electoral calendar constraints',
    ],
    predictionMarketAngle: 'Will IPL 2026 start on schedule (March 28)?',
    categoryLabel: 'Sports',
    categoryEmoji: '🏏',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-8',
    slug: 'india-wins-icc-t20-world-cup-2026',
    title: 'India Wins ICC T20 World Cup 2026',
    category: 'sports',
    status: 'completed',
    summary:
      'India retained ICC T20 World Cup, beating New Zealand in the final at Ahmedabad in a lopsided match.',
    mckinseyAnalysis: [
      'Historic back-to-back T20 World Cup retention',
      'Massive boost to cricket advertising and media valuations',
    ],
    predictionMarketAngle: 'Historical event – market resolved',
    categoryLabel: 'Sports',
    categoryEmoji: '🏆',
    updatedAt: '2026-03-08T00:00:00Z',
  },
  {
    id: 'evt-9',
    slug: 'west-asia-middle-east-crisis',
    title: 'West Asia / Middle East Crisis',
    category: 'geopolitics',
    status: 'critical',
    summary:
      'US and Israel ramped up airstrikes against Iran. Among most intense actions of the ongoing conflict. Oil prices surge past $101/barrel.',
    impactOnIndia: [
      'Crude oil surge directly impacts Indian economy (import dependent)',
      'LPG gas shortage across India',
      'Stock market correction',
      'Rupee at all-time low',
      'Could delay IPL 2026',
      'Inflation risk if sustained',
    ],
    mckinseyAnalysis: [
      "India's energy import dependency makes it highly vulnerable",
      'Every $10 increase in oil = ~0.3% fiscal deficit impact',
      'Current account deficit will widen',
      "RBI's inflation management complicated",
      'Strategic petroleum reserves being tapped globally',
    ],
    predictionMarketAngle: 'Will Iran-US ceasefire happen before April 2026?',
    categoryLabel: 'Geopolitics',
    categoryEmoji: '🌍',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-10',
    slug: 'india-tech-startup-ecosystem-2026',
    title: "India's Tech & Startup Ecosystem 2026",
    category: 'technology',
    status: 'active',
    summary:
      '209,000+ DPIIT-recognized startups. Funding expected $11.5-13.8Bn in 2026. Key sectors: AI/deeptech, fintech, healthtech, cleantech.',
    keyTrends: [
      'Digital lending market projected $350-400Bn by 2027',
      '15-20 AI-native startups expected as GCC spin-outs',
      'Semiconductor 2.0 and sovereign LLMs gaining traction',
      "India's ISM 2.0 policy driving hardware investment",
      'National Quantum Mission advancing',
    ],
    mckinseyAnalysis: [
      'Consolidation expected in consumer tech',
      'B2B models preferred in healthtech',
      'Clean-tech needs $200Bn+ energy investment by 2030',
      'Regulatory frameworks (data protection, financial compliance) shaping product design',
    ],
    predictionMarketAngle: 'Will Indian startup funding exceed $15Bn in 2026?',
    categoryLabel: 'Technology',
    categoryEmoji: '💻',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-11',
    slug: 'bollywood-march-2026-releases',
    title: 'Bollywood March 2026 Releases',
    category: 'entertainment',
    status: 'active',
    summary:
      'Major releases including Dhurandhar: The Revenge (Ranveer Singh), Toxic (Yash), Love & War (SLB), Aadu 3, Ramayana (Nov 2026).',
    keyReleases: [
      'March 19: Dhurandhar: The Revenge, Toxic, Aadu 3, Youth (4-way box office battle)',
      'March 26: Ustaad Bhagat Singh (Pawan Kalyan)',
      'Upcoming: Ramayana (Nov 2026), Drishyam 3, Border 2',
    ],
    mckinseyAnalysis: [
      'Multi-film clashes testing audience fragmentation patterns',
      'Pan-India appeal driving larger opening weekends',
    ],
    predictionMarketAngle: 'Which March 2026 film will have highest opening weekend?',
    categoryLabel: 'Entertainment',
    categoryEmoji: '🎬',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-12',
    slug: 'prediction-markets-legal-status-india',
    title: 'Prediction Markets Legal Status in India',
    category: 'regulation',
    status: 'active',
    summary:
      'Prediction markets (event betting) illegal under Indian gambling laws. Polymarket hosting India election bets offshore. Mint published editorial asking if India should allow prediction markets.',
    mckinseyAnalysis: [
      'Global prediction market industry growing rapidly',
      'Polymarket proven accurate in US elections',
      "India's regulatory framework needs updating",
      'Potential for regulated prediction markets in India',
    ],
    predictionMarketAngle: 'Will India legalize prediction markets by 2027?',
    categoryLabel: 'Regulation',
    categoryEmoji: '⚖️',
    updatedAt: '2026-03-13T00:00:00Z',
  },
];

export const EVENT_CATEGORIES: {
  value: EventCategory | 'all';
  label: string;
  emoji: string;
}[] = [
  { value: 'all', label: 'All Events', emoji: '🔥' },
  { value: 'markets', label: 'Markets', emoji: '📉' },
  { value: 'economy', label: 'Economy', emoji: '🏦' },
  { value: 'politics', label: 'Politics', emoji: '🗳️' },
  { value: 'sports', label: 'Sports', emoji: '🏏' },
  { value: 'geopolitics', label: 'Geopolitics', emoji: '🌍' },
  { value: 'technology', label: 'Technology', emoji: '💻' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { value: 'regulation', label: 'Regulation', emoji: '⚖️' },
];
