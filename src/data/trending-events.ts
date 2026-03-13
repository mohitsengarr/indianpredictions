export type EventCategory =
  | 'markets'
  | 'economy'
  | 'politics'
  | 'sports'
  | 'geopolitics'
  | 'technology'
  | 'entertainment'
  | 'regulation'
  | 'energy';

export type EventStatus = 'active' | 'critical' | 'upcoming' | 'completed';

export interface TrendingEvent {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  status: EventStatus;
  summary: string;
  imageUrl?: string;
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
      'Sensex sold off sharply on March 13, 2026 (down 1,470 points) with Nifty ending below 23,151 amid West Asia conflict escalation and crude oil near/above $100 per barrel.',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
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
    updatedAt: '2026-03-13T19:00:00Z',
  },
  {
    id: 'evt-2',
    slug: 'rbi-monetary-policy-rates-on-hold',
    title: 'RBI Monetary Policy – Rates on Hold',
    category: 'economy',
    status: 'active',
    summary:
      'RBI maintained repo rate at 5.25% (Feb 2026 MPC) and flagged geopolitical tensions, volatile energy prices and adverse weather as key upside risks. Feb 2026 CPI inflation accelerated to 3.21% y/y (from 2.74% in Jan), with food inflation at 3.47% (vs 2.13%). New RBI projections put FY26 inflation at 2.1% (Q4: 3.2%) and FY27 inflation at 4.0% (Q1) / 4.2% (Q2); FY26 GDP growth is seen at 7.4%, with FY27 Q1/Q2 at 6.9%/7.0%.',
    keyDataPoints: [
      { label: 'GDP Growth FY26', value: '7.4%' },
      { label: 'GDP Growth FY27 Q1', value: '6.9%' },
      { label: 'GDP Growth FY27 Q2', value: '7.0%' },
      { label: 'Inflation FY26 (avg)', value: '2.1%' },
      { label: 'Feb 2026 CPI (y/y)', value: '3.21%' },
      { label: 'Feb 2026 Food Inflation (y/y)', value: '3.47%' },
      { label: 'Inflation FY26 Q4', value: '3.2%' },
      { label: 'Inflation FY27 Q1', value: '4.0%' },
      { label: 'Inflation FY27 Q2', value: '4.2%' },
    ],
    mckinseyAnalysis: [
      'India remains fastest-growing major economy for 4th consecutive year',
      'Private consumption growth expected to rise to 7.7% YoY in 2026',
      'US-India trade deal lowering uncertainty',
      'India-EU FTA progress adding confidence',
      'Rising oil prices could complicate inflation outlook',
    ],
    predictionMarketAngle:
      'Will FY26 inflation print below 3.0% (annual average) as projected by RBI?',
    categoryLabel: 'Economy',
    categoryEmoji: '🏦',
    updatedAt: '2026-03-13T18:00:00Z',
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
      'IPL 2026 first phase: March 28–April 12 (20 matches across 10 venues) with 4 double-headers. Full schedule will follow after State Assembly election dates are announced; Bengaluru matches subject to Karnataka government expert-committee clearance.',
    keyDetails: [
      'Opening match: RCB vs SRH at M Chinnaswamy Stadium (March 28)',
      'Mumbai Indians vs KKR at Wankhede (March 29)',
      '4 double-headers scheduled',
      'BCCI coordinating with Election Commission on full schedule',
      'West Asia conflict causing LPG shortage may delay start',
    ],
    mckinseyAnalysis: [
      'Split-phase scheduling reflects election-calendar constraints and logistical risk management',
      'Ticketing, travel and broadcast planning face higher uncertainty (impacts sponsors, franchises, and fans)',
      'Stadium safety/compliance has become a gating factor after prior incidents; Bengaluru matches explicitly conditional on expert-committee clearance',
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
      'West Asia conflict continued to intensify into mid-March 2026, pushing crude oil back toward ~$100/bbl and tightening global risk appetite.',
    impactOnIndia: [
      'Crude oil surge directly impacts Indian economy (import dependent)',
      'LPG gas shortage across India',
      'Stock market correction',
      'Rupee at all-time low',
      'Could delay IPL 2026',
      'Inflation risk if sustained',
    ],
    mckinseyAnalysis: [
      "India's energy import dependency (imports ~90% of crude) makes it highly vulnerable",
      'Every $10 increase in oil = ~0.3% fiscal deficit impact',
      'If Brent averages ~$100/bbl, economists project India\'s current account deficit could widen to ~1.9–2.2% of GDP in FY2026/27 (from ~0.0–0.8% projected)',
      "Higher crude raises inflation risk (Reuters cited estimates around ~4.1% inflation with $100/bbl averages)",
      'Strategic petroleum reserves being tapped globally',
    ],
    predictionMarketAngle: 'Will Iran-US ceasefire happen before April 2026?',
    categoryLabel: 'Geopolitics',
    categoryEmoji: '🌍',
    updatedAt: '2026-03-13T19:00:00Z',
  },
  {
    id: 'evt-10',
    slug: 'startup-india-fund-of-funds-2-0',
    title: 'Cabinet approves Startup India Fund of Funds 2.0 (₹10,000 crore)',
    category: 'technology',
    status: 'active',
    summary:
      'The Union Cabinet approved Startup India Fund of Funds 2.0 with a ₹10,000 crore corpus to mobilise long-term domestic capital via venture funds, with a focus on deep tech and tech-driven innovative manufacturing, early-growth founders, and broader geographic reach beyond major metros.',
    keyDrivers: [
      'Government push to crowd-in domestic risk capital amid tighter global liquidity',
      'Strategic priority on deep tech / innovative manufacturing that needs patient capital',
      'Policy intent to expand venture funding beyond top metros',
    ],
    keyDataPoints: [
      { label: 'Corpus', value: '₹10,000 crore' },
      { label: 'Instrument', value: 'Fund-of-funds investing via AIFs' },
      { label: 'Focus areas', value: 'Deep tech, innovative manufacturing, early-growth' },
    ],
    mckinseyAnalysis: [
      'Likely to shift the margin of funding availability for capital-intensive deep tech where private VCs often under-allocate (hardware, semis, space, defence-tech, industrial AI).',
      'Second-order impact is ecosystem-wide: fund-of-funds commitments can reduce fundraising risk for emerging domestic AIF managers, potentially improving competition and term discipline.',
      'Execution risk is governance and selection: impact depends on AIF manager quality, deployment pace, and whether capital truly reaches non-metro founders instead of recycling into late-stage metro deals.',
      'If deployed counter-cyclically (during private risk-off), the scheme can stabilise startup capex and talent retention; if deployed pro-cyclically, it may have limited incremental impact.',
      'Stakeholders: DPIIT/SIDBI (implementation), domestic AIFs/VCs, deep-tech founders, strategic sectors (manufacturing, climate, defence), and downstream LPs (banks/insurers/pensions) that may co-invest.',
    ],
    impactProbability:
      'Medium-High – approval is done; market impact depends on rollout speed and AIF selection quality.',
    predictionMarketAngle:
      'Will Startup India FoF 2.0 commit to 50+ AIFs by end of FY27?',
    categoryLabel: 'Technology',
    categoryEmoji: '💻',
    updatedAt: '2026-03-14T00:00:00Z',
  },
  {
    id: 'evt-10b',
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
  {
    id: 'evt-13',
    slug: 'lpg-crisis-deepens-india',
    title: "India's LPG Crisis Deepens – Kitchens Face Fuel Shortage",
    category: 'economy',
    status: 'critical',
    summary:
      "India's LPG cooking gas supply severely disrupted. 60% of India's LPG is imported through Strait of Hormuz. Delhi eateries closing. Maharashtra sets up control rooms. Domestic LPG production up 28% but insufficient.",
    keyDrivers: [
      '60% of LPG imported via Strait of Hormuz – now a conflict zone',
      'Restaurants, hostels, eateries reporting acute shortages',
      'Delhi eateries forced to close, Maharashtra sets up emergency control rooms',
    ],
    mckinseyAnalysis: [
      'Supply chain vulnerability exposed – over-reliance on single maritime chokepoint',
      'Domestic production increase of 28% insufficient to offset import disruption',
      'Food services sector facing cascading economic impact',
      'PM Modi draws parallel to Covid response – signals emergency measures incoming',
    ],
    predictionMarketAngle: "Will India's LPG shortage last beyond April 2026?",
    categoryLabel: 'Economy',
    categoryEmoji: '🔥',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-14',
    slug: 'indian-sailors-killed-iran-strike',
    title: 'Indian Sailors Killed in Iran Strike on US-Owned Ship',
    category: 'geopolitics',
    status: 'critical',
    summary:
      'Iran struck a US-owned ship with Indian sailors on board near Strait of Hormuz. 3 Indian sailors killed, 1 missing, 4 injured. Jaishankar held talks with Iran\'s Araghchi. India demanding answers.',
    keyDrivers: [
      'Iran struck US-owned vessel carrying Indian crew',
      '3 Indian sailors killed, 1 missing, 4 injured',
      'Jaishankar in direct talks with Iran Foreign Minister Araghchi',
    ],
    impactOnIndia: [
      'Indian maritime worker safety in conflict zones at risk',
      'Diplomatic tensions between India and Iran escalating',
      'Potential disruption to Indian shipping through Hormuz',
    ],
    mckinseyAnalysis: [
      'India faces diplomatic tightrope between Iran ties and US alliance',
      'Maritime insurance costs for Indian vessels set to spike',
      'Could accelerate India\'s push for alternative energy supply routes',
    ],
    predictionMarketAngle: 'Will India impose sanctions on Iran over sailor deaths?',
    categoryLabel: 'Geopolitics',
    categoryEmoji: '⚠️',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-15',
    slug: 'forex-reserves-drop-11-billion',
    title: "India's Forex Reserves Drop $11.68 Billion",
    category: 'economy',
    status: 'active',
    summary:
      'Foreign exchange reserves fell to $716.81 billion, down $11.68 billion. RBI spent defending the rupee as it hit all-time lows against the US dollar.',
    keyDataPoints: [
      { label: 'Current Reserves', value: '$716.81B' },
      { label: 'Weekly Drop', value: '$11.68B' },
      { label: 'RBI Action', value: 'Active rupee defense' },
    ],
    mckinseyAnalysis: [
      'Largest single-week reserve drawdown signals aggressive RBI intervention',
      'Rupee defense strategy unsustainable if oil stays above $100',
      'Import cover still comfortable at ~9 months but declining',
    ],
    predictionMarketAngle: "Will India's forex reserves fall below $700 billion by April 2026?",
    categoryLabel: 'Economy',
    categoryEmoji: '💱',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-16',
    slug: 'bjp-finalises-bengal-candidates',
    title: 'BJP Finalises 160+ Candidates for Bengal Elections',
    category: 'politics',
    status: 'active',
    summary:
      'BJP has finalised 160-odd candidate names for West Bengal assembly elections. First candidate list expected March 14. Major election preparation milestone.',
    mckinseyAnalysis: [
      'Early candidate announcement signals BJP confidence in Bengal strategy',
      'TMC going solo – no opposition alliance to contend with',
      'Identity politics and anti-incumbency factors at play',
    ],
    predictionMarketAngle: 'Will BJP win more than 100 seats in West Bengal 2026?',
    categoryLabel: 'Politics',
    categoryEmoji: '🗳️',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-17',
    slug: '193-mps-seek-cec-removal',
    title: '193 Opposition MPs Seek Removal of Chief Election Commissioner',
    category: 'politics',
    status: 'active',
    summary:
      '193 opposition MPs have jointly sought removal of Chief Election Commissioner Gyanesh Kumar, alleging bias. Unprecedented move ahead of state elections.',
    mckinseyAnalysis: [
      'Unprecedented scale of opposition unity on institutional challenge',
      'Directly impacts credibility perception of upcoming state elections',
      'Constitutional mechanism for CEC removal rarely invoked – signals deep institutional distrust',
    ],
    predictionMarketAngle: 'Will the Chief Election Commissioner be replaced before state elections?',
    categoryLabel: 'Politics',
    categoryEmoji: '⚖️',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-18',
    slug: 'india-uk-fta-coming-into-force',
    title: 'India-UK Free Trade Agreement Coming Into Force',
    category: 'economy',
    status: 'active',
    summary:
      'Commerce Minister Piyush Goyal confirms India-UK FTA will come into force within one month. Major trade milestone after years of negotiation.',
    mckinseyAnalysis: [
      'UK is India\'s 6th largest trading partner – FTA unlocks preferential access',
      'Indian IT services and pharmaceuticals expected to be primary beneficiaries',
      'Could serve as template for India-EU FTA negotiations',
    ],
    predictionMarketAngle: 'Will India-UK trade cross $50 billion within first year of FTA?',
    categoryLabel: 'Economy',
    categoryEmoji: '🤝',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-19',
    slug: 'india-delays-us-trade-deal',
    title: 'India Holds Off on US Trade Deal Amid Tariff Concerns',
    category: 'economy',
    status: 'active',
    summary:
      "Reuters (Mar 13, 2026) reports India will hold off signing an interim US trade deal for several months amid new US investigations into what it calls 'structural excess capacity' among trading partners and broader tariff uncertainty.",
    keyDrivers: [
      'Fresh US tariff threats creating uncertainty',
      "US launched new probes/investigations that add friction to talks (incl. 'structural excess capacity' under Section 301)",
      'Farmer protests in Delhi against trade deal terms',
    ],
    mckinseyAnalysis: [
      'India weighing short-term tariff relief vs long-term sovereignty concerns',
      'Agricultural lobby remains key political constraint on trade liberalization',
      'New US investigations increase policy uncertainty and reduce near-term probability of a quick interim deal',
    ],
    predictionMarketAngle: 'Will India-US trade deal be signed before June 2026?',
    categoryLabel: 'Economy',
    categoryEmoji: '🇺🇸',
    updatedAt: '2026-03-13T19:00:00Z',
  },
  {
    id: 'evt-20',
    slug: 'bharat-coking-coal-ipo-record',
    title: 'Bharat Coking Coal IPO Creates History – 90 Lakh Applications',
    category: 'markets',
    status: 'active',
    summary:
      "Bharat Coking Coal's IPO received record 90 lakh (9 million) applications, creating history in Indian capital markets. Historic retail investor participation.",
    mckinseyAnalysis: [
      'Record retail participation signals deepening of Indian equity culture',
      'PSU disinvestment program gaining strong public support',
      'Oversubscription levels suggest significant listing premium expected',
    ],
    predictionMarketAngle: 'Will BCCL stock trade above listing price after 30 days?',
    categoryLabel: 'Markets',
    categoryEmoji: '📊',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-21',
    slug: 'pm-modi-assam-projects-19680-crore',
    title: 'PM Modi Launches ₹19,680 Crore Assam Projects',
    category: 'politics',
    status: 'active',
    summary:
      'PM Modi launched ₹19,680 crore worth of projects in Assam, distributed land pattas to tea workers. Key election rally ahead of Assam assembly elections.',
    mckinseyAnalysis: [
      'Pre-election spending boost in key northeastern state',
      'Land patta distribution targets tea worker demographic – a large vote bank',
      'Infrastructure investment aligns with BJP\'s Northeast development narrative',
    ],
    predictionMarketAngle: 'Will BJP retain Assam in 2026 elections?',
    categoryLabel: 'Politics',
    categoryEmoji: '🏗️',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-22',
    slug: 'fitch-raises-india-gdp-7-5',
    title: 'Fitch Raises India GDP Growth Estimate to 7.5%',
    category: 'economy',
    status: 'active',
    summary:
      'Fitch Ratings increased India\'s GDP growth estimate for FY26 to 7.5%, citing strong domestic demand despite global headwinds.',
    keyDataPoints: [
      { label: 'New GDP Estimate', value: '7.5%' },
      { label: 'Previous Estimate', value: '7.0%' },
      { label: 'Key Driver', value: 'Domestic demand' },
    ],
    mckinseyAnalysis: [
      'India outpacing all major economies in growth trajectory',
      'Strong domestic consumption offsetting external demand weakness',
      'Upgrade despite global uncertainty signals structural strength',
    ],
    predictionMarketAngle: "Will India's actual FY26 GDP growth exceed 7.5%?",
    categoryLabel: 'Economy',
    categoryEmoji: '📈',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-23',
    slug: 'india-cpi-inflation-rises-3-21',
    title: 'India CPI Inflation Rises to 3.21% in February',
    category: 'economy',
    status: 'active',
    summary:
      "India's domestic inflation rose to 3.21% in February 2026. Still below RBI's 4% target but rising trend noted amid oil price surge.",
    keyDataPoints: [
      { label: 'Feb CPI', value: '3.21%' },
      { label: 'RBI Target', value: '4.0%' },
      { label: 'Trend', value: 'Rising' },
    ],
    mckinseyAnalysis: [
      'Inflation trending up but still within RBI comfort zone',
      'Oil price surge could push CPI above 4% threshold by Q2',
      'Food inflation moderating but fuel inflation accelerating',
    ],
    predictionMarketAngle: "Will India's CPI inflation breach 4% by June 2026 due to oil prices?",
    categoryLabel: 'Economy',
    categoryEmoji: '📊',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-24',
    slug: 'sensex-loses-19-lakh-crore',
    title: 'Sensex Loses ₹19 Lakh Crore in One Week',
    category: 'markets',
    status: 'critical',
    summary:
      'Investors lost ₹19 lakh crore in one week. Nifty below 23,200. FIIs sold over ₹10,000 crore in March alone. Third consecutive day of selling pressure.',
    keyDataPoints: [
      { label: 'Wealth Eroded', value: '₹19 Lakh Cr' },
      { label: 'FII Selling (March)', value: '₹10,000+ Cr' },
      { label: 'Nifty Level', value: 'Below 23,200' },
    ],
    mckinseyAnalysis: [
      'FII exodus accelerating – third consecutive day of heavy selling',
      'Geopolitical risk premium being aggressively repriced',
      'Domestic institutional investors providing partial buffer but insufficient',
      'Technical support levels being breached – further downside risk',
    ],
    predictionMarketAngle: 'Will the market recover 50% of losses by end of March?',
    categoryLabel: 'Markets',
    categoryEmoji: '📉',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-25',
    slug: 'rbi-digital-fraud-compensation',
    title: 'RBI Draft Guidelines on Digital Fraud Compensation',
    category: 'regulation',
    status: 'active',
    summary:
      'RBI released draft guidelines for compensating customers for digital fraud. Coverage up to 85% of lost amount or max ₹25,000. Major consumer protection move.',
    mckinseyAnalysis: [
      'Addresses growing digital fraud concerns as UPI adoption scales',
      'Compensation framework could boost consumer confidence in digital payments',
      'Banks may need to invest more in fraud prevention to limit payouts',
    ],
    predictionMarketAngle: "Will RBI's digital fraud compensation scheme reduce reported fraud cases by 20%+?",
    categoryLabel: 'Regulation',
    categoryEmoji: '🛡️',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-26',
    slug: 'india-lpg-crisis-cooking-gas-shortage',
    title: "India LPG Crisis – National Cooking Gas Shortage",
    category: 'energy',
    status: 'critical',
    summary:
      'India consumes 31.3M tonnes LPG annually; 62% imported. Strait of Hormuz closure cut off 85-90% of LPG imports from Saudi Arabia & Qatar. LPG Control Order issued. Commercial supply restricted. Induction cooktops sold out nationwide.',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    keyDrivers: [
      'Strait of Hormuz blockade cut 85-90% LPG import route',
      'LPG Control Order issued March 8 – refineries ordered to maximize production',
      'Commercial LPG supply restricted – restaurants and hotels hardest hit',
      'Induction cooktops sold out on Amazon, Flipkart, Blinkit',
    ],
    mckinseyAnalysis: [
      "India's over-dependence on imported LPG exposes critical vulnerability – 62% imported via single maritime chokepoint",
      'Restaurant industry (Rs 5L Cr sector) facing shutdowns, 300M+ households affected',
      'PNG (piped gas) households unaffected – highlighting infrastructure gap',
      'Government rationing possible if Hormuz stays blocked beyond 2-4 weeks',
    ],
    impactProbability: '70% crisis continues 2-4 weeks; rationing possible',
    predictionMarketAngle: 'Will India impose LPG rationing for households by April 2026?',
    categoryLabel: 'Energy',
    categoryEmoji: '🔥',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-27',
    slug: 'indian-rupee-record-low-march-2026',
    title: 'Indian Rupee Hits Record Low – 92.43/Dollar',
    category: 'economy',
    status: 'active',
    summary:
      'Rupee hit lifetime low of 92.4325/dollar on March 13. Currency lost 1.5% since Iran war began. RBI actively selling dollars to slow depreciation.',
    keyDataPoints: [
      { label: 'Record Low', value: '92.4325/USD' },
      { label: 'Depreciation (since war)', value: '1.5%' },
      { label: 'RBI Response', value: 'Active dollar sales' },
    ],
    mckinseyAnalysis: [
      'Currency depreciation adding to imported inflation pressure',
      'RBI forex reserves being depleted to defend currency',
      'Exporters benefit short-term but import costs surging',
      'Remittances from Gulf NRIs at risk if conflict worsens',
    ],
    predictionMarketAngle: 'Will the rupee breach 95/dollar by April 2026?',
    categoryLabel: 'Economy',
    categoryEmoji: '💹',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-28',
    slug: 'india-defence-exports-record',
    title: 'India Defence Exports Hit Record ₹23,622 Crore',
    category: 'economy',
    status: 'active',
    summary:
      'Indian defence exports hit record ₹23,622 crore in FY25 (April 2024-March 2025), surpassing the ₹21,083 crore target. 100x growth since 2014.',
    keyDataPoints: [
      { label: 'FY25 Exports', value: '₹23,622 Cr' },
      { label: 'Target (FY25)', value: '₹21,083 Cr' },
      { label: 'Growth since 2014', value: '100x' },
    ],
    mckinseyAnalysis: [
      'Geopolitical tailwinds are accelerating India’s defence export ambitions',
      'Iran war may paradoxically boost Indian arms export opportunities in conflict-adjacent markets',
      'Drone, missile, and naval systems gaining global buyers',
    ],
    predictionMarketAngle: 'Will India defence exports cross ₹30,000 crore by FY27?',
    categoryLabel: 'Economy',
    categoryEmoji: '🇳',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-29',
    slug: 'india-crude-oil-price-impact',
    title: 'Crude Oil Above $100 – India’s Fiscal & Inflation Dilemma',
    category: 'energy',
    status: 'critical',
    summary:
      'Brent crude crossed $100/bbl on March 13 for the first time since 2023. Every $10 rise adds ~$15B to India’s import bill annually. FY26 fiscal deficit target of 4.9% GDP at serious risk.',
    keyDataPoints: [
      { label: 'Brent Crude', value: '$100+/bbl' },
      { label: 'India’s Crude Import (FY25)', value: '~$130-140B/year' },
      { label: 'Fiscal Deficit Target', value: '4.9% GDP (FY26)' },
    ],
    mckinseyAnalysis: [
      'Oil above $100 creates compounding fiscal pressure: higher subsidy bill + lower disinvestment proceeds + weaker rupee',
      'India imports ~90% crude; no strategic alternative in short-term',
      'Iran discounted oil supply (pre-war) now disrupted – refiners switching to expensive alternatives',
    ],
    impactProbability: 'Critical – oil above $100 for 2+ weeks = serious macro consequence',
    predictionMarketAngle: 'Will Brent crude average above $100 for the full month of March 2026?',
    categoryLabel: 'Energy',
    categoryEmoji: '⛽',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-30',
    slug: 'india-china-border-relations-2026',
    title: 'India-China Border Relations – Thaw or New Tensions?',
    category: 'geopolitics',
    status: 'active',
    summary:
      'India and China completed disengagement at Depsang and Demchok in late 2024. Modi-Xi summit held. But China is exploiting Iran war distraction. 2026 starts with cautious engagement but underlying strategic competition intact.',
    mckinseyAnalysis: [
      'Disengagement deal reduces immediate military flashpoint risk',
      'Both nations economically incentivized to normalize but strategic competition continues',
      'Iran war provides China strategic distraction opportunity in South Asia',
      'India must balance US alignment with China border management',
    ],
    predictionMarketAngle: 'Will India-China trade surpass pre-2020 levels in FY2026?',
    categoryLabel: 'Geopolitics',
    categoryEmoji: '🌏',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-32',
    slug: 'india-semiconductor-mission-2026',
    title: 'India Semiconductor Mission – First Chip by 2026?',
    category: 'technology',
    status: 'active',
    summary:
      'Tata Electronics, Micron, and CG Power plants under construction. First Made-in-India chip expected in 2025-26. $15B incentive scheme progressing.',
    keyDataPoints: [
      { label: 'Total Incentive', value: '$15 billion' },
      { label: 'Key Players', value: 'Tata, Micron, CG Power' },
      { label: 'First Chip Target', value: '2025-26' },
    ],
    mckinseyAnalysis: [
      'First phase focused on assembly/testing; fabrication is a longer 5-10 year journey',
      'Geopolitical tailwinds: US-China tech decoupling making India an alternative supply chain node',
      'Key bottleneck: skilled workforce pipeline for semiconductor manufacturing',
    ],
    predictionMarketAngle: 'Will India produce its first domestic semiconductor chip by end of 2026?',
    categoryLabel: 'Technology',
    categoryEmoji: '💻',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-31',
    slug: 'us-tariffs-india-impact',
    title: 'US Tariffs – Impact on Indian Exporters',
    category: 'economy',
    status: 'active',
    summary:
      'Trump’s tariff policies creating headwinds for Indian exporters. Key sectors at risk: IT, pharma, textiles, gems & jewelry. India seeking bilateral deal to reduce exposure.',
    mckinseyAnalysis: [
      'India more exposed than most Asians due to US service exports (IT, BPO)',
      'Pharma: 26% of US generic drugs are Indian-made',
      'Gems & jewelry, textiles face blunt tariff impacts',
      'Long-term: tariff uncertainty accelerating India’s FTA diplomacy with EU and UK',
    ],
    predictionMarketAngle: 'Will US tariffs on India increase above 15% by mid-2026?',
    categoryLabel: 'Economy',
    categoryEmoji: '🇺🇸',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-32',
    slug: 'upi-global-expansion',
    title: 'UPI Global Expansion – 20 Countries by 2026',
    category: 'technology',
    status: 'active',
    summary:
      'UPI now live in 7 countries. NPCI International targeting 20 countries by 2026. Transaction volume: 18B monthly. Cross-border remittances a key growth area.',
    mckinseyAnalysis: [
      'UPI’s global footprint is a fintech soft-power play for India',
      'Remittance corridors (Gulf, Singapore, UK) are highest-value targets',
      'Competition with Visa/Mastercard’s dominance in cross-border payments',
    ],
    predictionMarketAngle: 'Will UPI reach 20 countries by end of 2026?',
    categoryLabel: 'Technology',
    categoryEmoji: '📱',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-33',
    slug: 'india-electric-vehicle-market-2026',
    title: 'India EV Market – Race to 30% Penetration',
    category: 'technology',
    status: 'active',
    summary:
      'EV penetration hit 7.5% in FY25. Tata, MG, BYD, Ola leading. Charging infra reaching 25,000+ stations. Government targeting 30% EV sales by 2030.',
    mckinseyAnalysis: [
      'Two-wheeler EVs driving volume; four-wheeler EVs driving revenue',
      'Charging infra gap: 1 charger per 135 EVs vs global benchmark of 1:10',
      'Iranian oil crisis could paradoxically accelerate EV adoption',
    ],
    predictionMarketAngle: 'Will India EV sales penetration exceed 10% in FY26?',
    categoryLabel: 'Technology',
    categoryEmoji: '⚡',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-34',
    slug: 'india-water-crisis-2026',
    title: 'India Water Crisis – Chennai, Bengaluru on Alert',
    category: 'economy',
    status: 'active',
    summary:
      'Chennai, Bengaluru, and Hyderabad facing acute water stress. Groundwater depletion 3x faster than recharge rates. 40% of India’s cities to face Day Zero by 2030.',
    mckinseyAnalysis: [
      'Water scarcity threatening India’s semiconductor and data centre ambitions (both are water-intensive)',
      'Agricultural sector (70% water use) competing with urban/industrial demand',
      'Climate change compounding seasonal rainfall variability',
    ],
    predictionMarketAngle: 'Will a major Indian city declare water emergency in 2026?',
    categoryLabel: 'Economy',
    categoryEmoji: '💧',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-35',
    slug: 'india-pakistan-ceasefire-watch-2026',
    title: 'India-Pakistan Relations – Ceasefire Line Tensions',
    category: 'geopolitics',
    status: 'active',
    summary:
      'Ceasefire along LoC holding since 2021 but cross-border incidents rising. Pakistan Army reshuffle creating uncertainty. Iran war shifting regional power dynamics.',
    mckinseyAnalysis: [
      'Pakistan’s economic crisis limiting its capacity for sustained military adventurism',
      'Iran conflict changes Pakistan’s strategic calculus (shares long Iran border)',
      'India-Pakistan CBMs at lowest in years',
    ],
    predictionMarketAngle: 'Will there be a significant India-Pakistan military incident in 2026?',
    categoryLabel: 'Geopolitics',
    categoryEmoji: '🌍',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-36',
    slug: 'india-space-economy-2026',
    title: 'India Space Economy – $44 Billion Target by 2033',
    category: 'technology',
    status: 'active',
    summary:
      'ISRO + IN-SPACe framework unlocked private space. Agnikul, Skyroot, Pixxel gaining traction. Chandrayaan-4 and Gaganyaan on track. Target: 10x growth to $44B by 2033.',
    mckinseyAnalysis: [
      'Policy reforms (IN-SPACe) are the key unlock for private sector participation',
      'Ground station economics and data services are near-term revenue opportunities',
      'Competition from SpaceX Starlink in satellite internet space',
    ],
    predictionMarketAngle: 'Will India successfully launch a private Indian rocket in 2026?',
    categoryLabel: 'Technology',
    categoryEmoji: '🚀',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-37',
    slug: 'india-inequality-wealth-gap-2026',
    title: 'India’s Wealth Gap – Top 1% Own 40% of Wealth',
    category: 'economy',
    status: 'active',
    summary:
      'Oxfam 2026 report: India’s top 1% hold 40.1% of national wealth. Bottom 50% hold just 6.4%. Billionaire wealth grew 35% in 2025 while median wages rose just 3%.',
    mckinseyAnalysis: [
      'Wealth concentration threatening social cohesion and long-term consumption growth',
      'Gig economy growth masking structural wage stagnation',
      'Political pressure building for wealth redistribution policies',
    ],
    predictionMarketAngle: 'Will India introduce a wealth tax or super-rich tax by 2027?',
    categoryLabel: 'Economy',
    categoryEmoji: '💰',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-38',
    slug: 'iran-war-impact-india-economy',
    title: 'Iran War Impact on India – Multi-Sector Crisis',
    category: 'geopolitics',
    status: 'critical',
    summary:
      'The Iran-US/Israel war is causing cascading impacts on India: oil above $100, LPG crisis, rupee at record low, stock market crash, FII outflows of Rs 52,000 Cr, and 10M Indians in Gulf at risk. India\'s biggest external shock since COVID.',
    keyDrivers: [
      'Strait of Hormuz blockade disrupting oil/LPG supplies',
      'FII outflows of Rs 52,000 crore this month',
      '10 million Indians in Gulf at risk',
    ],
    impactOnIndia: [
      'Oil above $100 → import bill surge → fiscal deficit risk',
      'LPG shortage → restaurant shutdowns → household cooking disrupted',
      'Rupee at 92.43 → import costs rising → inflation acceleration',
      'Stock market lost Rs 25 lakh crore since war began',
    ],
    mckinseyAnalysis: [
      'India faces interconnected crisis: energy → economy → currency → markets → daily life',
      'Every $10 increase in oil = ~0.3% fiscal deficit impact and 25-30 bps inflation',
      'India\'s diplomatic tightrope: Iran ties, Israel alliance, Arab relationships all at stake',
    ],
    impactProbability: 'Critical – cascading multi-sector impact across Indian economy',
    predictionMarketAngle: 'Will Iran-US ceasefire happen before April 2026?',
    categoryLabel: 'Geopolitics',
    categoryEmoji: '⚠️',
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
  { value: 'energy', label: 'Energy', emoji: '⛽' },
];
