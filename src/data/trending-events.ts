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
    updatedAt: '2026-03-14T00:00:00Z',
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
      "India's exporters faced the steepest tariff barriers among APAC nations in 2025",
      "Deal expected to unlock India's private investment cycle and boost manufacturing",
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
      'Sustained central bank buying (especially China) underpins prices',
      'India retail demand may soften if prices exceed psychological thresholds',
    ],
    predictionMarketAngle:
      'Will gold cross ₹1,65,000/10g by April 15, 2026 given current momentum?',
    categoryLabel: 'Commodities',
    categoryEmoji: '🥇',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-5',
    slug: 'west-bengal-tamil-nadu-kerala-assembly-elections-2026',
    title: '2026 Assembly Elections: WB, TN, Kerala',
    category: 'politics',
    status: 'upcoming',
    summary:
      'Three major states (West Bengal, Tamil Nadu, Kerala) expected to go to polls in 2026 with high-stakes contests impacting national narrative and Rajya Sabha composition.',
    keyBattles: [
      { state: 'West Bengal', detail: 'TMC vs BJP vs Left-Congress dynamics' },
      { state: 'Tamil Nadu', detail: 'DMK vs AIADMK + actor-led TVK wildcard' },
      { state: 'Kerala', detail: 'LDF vs UDF vs BJP expansion push' },
    ],
    mckinseyAnalysis: [
      'Electoral outcomes will shape 2029 narrative and alliance bargaining power',
      'Policy continuity risks: state-level capex, welfare spending, investment approvals',
      'Potential market sensitivity in sectors tied to state procurement and infra',
    ],
    predictionMarketAngle:
      'Will the ruling party retain power in at least 2 of these 3 states in 2026?',
    categoryLabel: 'Politics',
    categoryEmoji: '🗳️',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-6',
    slug: 'new-income-tax-act-2025-effective-april-2026',
    title: 'New Income Tax Act, 2025 (Effective April 2026)',
    category: 'politics',
    status: 'upcoming',
    summary:
      'Union Budget 2026-27 announced that the new Income Tax Act, 2025 will come into effect from April 2026, aiming to simplify rules and reduce multiplicity of proceedings.',
    mckinseyAnalysis: [
      'Compliance simplification could improve taxpayer experience and reduce litigation',
      'Transition risk: interpretation gaps, software changes, and implementation capacity',
      'Potential medium-term boost to formalization and collections efficiency',
    ],
    predictionMarketAngle:
      'Will the new Income Tax Act implementation be deferred beyond April 2026?',
    categoryLabel: 'Politics',
    categoryEmoji: '🏛️',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-7',
    slug: 'ipl-2026-first-phase-schedule',
    title: 'IPL 2026 First-Phase Schedule Announced',
    category: 'sports',
    status: 'active',
    summary:
      'BCCI announced the first phase schedule of IPL 2026 (March 28 to April 12) with 20 matches across 10 venues; full schedule pending state election dates and Bengaluru clearances.',
    keyDetails: [
      'First phase runs March 28 to April 12, 2026',
      '20 matches across 10 venues',
      'Full schedule depends on state election dates',
      'Bengaluru matches subject to Karnataka expert committee inspection (March 13)',
    ],
    mckinseyAnalysis: [
      'Two-phase scheduling reduces election-related disruption risk but adds uncertainty to logistics and broadcasting',
      'Venue approval risk in Bengaluru is a key single-point-of-failure for early fixtures',
      'Consumer spending uplift likely around weekends/double-headers; ad inventory pricing linked to schedule certainty',
    ],
    predictionMarketAngle:
      'Will Bengaluru get clearance to host all scheduled IPL matches in March–April 2026?',
    categoryLabel: 'Sports',
    categoryEmoji: '🏏',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-8',
    slug: 'india-west-asia-escalation-energy-shock',
    title: 'West Asia Escalation: Energy Shock Risk to India',
    category: 'geopolitics',
    status: 'critical',
    summary:
      'Escalation in West Asia is pushing crude prices higher, raising inflation risks and potential current account pressures for India; policymakers may need fuel excise adjustments and subsidy buffers.',
    impactOnIndia: [
      'Higher fuel import bill (CAD pressure)',
      'Upside risk to CPI via transport and LPG',
      'Potential pressure on INR and bond yields',
      'Risk to Indian diaspora safety and remittances',
    ],
    mckinseyAnalysis: [
      'India is structurally exposed to energy price spikes due to high import dependence',
      'Policy trade-off: inflation control vs fiscal consolidation (excise cuts/subsidies)',
      'Second-order effects likely via fertilizers, aviation, logistics and MSME margins',
    ],
    impactProbability: 'Medium-High – depends on duration and supply disruption',
    predictionMarketAngle:
      'Will Brent crude average above $100/barrel for the rest of March 2026?',
    categoryLabel: 'Geopolitics',
    categoryEmoji: '🌍',
    updatedAt: '2026-03-13T19:00:00Z',
  },
  {
    id: 'evt-9',
    slug: 'startup-india-fund-of-funds-2',
    title: 'Startup India Fund-of-Funds 2.0 (₹10,000 crore)',
    category: 'technology',
    status: 'active',
    summary:
      'Government approved a ₹10,000 crore (₹100B) Startup India Fund-of-Funds 2.0 to catalyze domestic VC funding and back next-generation startups via SEBI-registered AIFs.',
    mckinseyAnalysis: [
      'Crowding-in effect: public anchor capital can unlock private LP allocations',
      'Policy intent: boost deeptech/strategic sectors and domestic innovation capacity',
      'Execution risk: pace of commitments, AIF selection, and capital recycling timelines',
    ],
    predictionMarketAngle:
      'Will Fund-of-Funds 2.0 commit at least ₹2,000 crore to AIFs by Sep 30, 2026?',
    categoryLabel: 'Technology',
    categoryEmoji: '💻',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-10',
    slug: 'india-box-office-big-release-2026',
    title: 'Bollywood Box Office: Major March Releases',
    category: 'entertainment',
    status: 'active',
    summary:
      'Major Hindi releases in March are testing theatrical demand amid streaming competition; early weekend numbers will set distributor confidence for the quarter.',
    mckinseyAnalysis: [
      'Box office outcomes influence studio greenlighting and marketing spends',
      'Regional language content is taking incremental share in tier-2/3 markets',
      'OTT windowing and pricing power depend on theatrical performance',
    ],
    predictionMarketAngle:
      'Will the top Bollywood release in March 2026 cross ₹100 crore domestic net in its first 10 days?',
    categoryLabel: 'Entertainment',
    categoryEmoji: '🎬',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-11',
    slug: 'prediction-markets-regulation-india-2026',
    title: 'Prediction Markets: Regulatory Signals',
    category: 'regulation',
    status: 'active',
    summary:
      'Policy debate continues on whether prediction markets should be regulated as gaming, derivatives, or a new category; enforcement posture could shift based on high-profile cases and election-period sensitivity.',
    mckinseyAnalysis: [
      'Regulatory classification will define permissible contracts, KYC norms, and tax treatment',
      'Election-related predictions increase scrutiny due to misinformation and manipulation risks',
      'A sandbox/limited pilot could emerge as compromise to test consumer safeguards',
    ],
    predictionMarketAngle:
      'Will India announce a formal consultation paper on prediction markets by June 30, 2026?',
    categoryLabel: 'Regulation',
    categoryEmoji: '⚖️',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-12',
    slug: 'rupee-volatility-dollar-strength',
    title: 'Rupee Volatility vs Strong Dollar',
    category: 'economy',
    status: 'active',
    summary:
      'Rupee volatility is increasing amid risk-off flows and oil price shock risk; RBI intervention and liquidity measures will be closely watched for INR stability.',
    mckinseyAnalysis: [
      'Oil-import bill and portfolio flows are the primary near-term INR drivers',
      'RBI has tools: FX swaps, spot interventions, liquidity ops to reduce disorderly moves',
      'Pass-through to inflation depends on duration and fuel pricing policy',
    ],
    predictionMarketAngle:
      'Will USD/INR cross 85.50 before April 15, 2026?',
    categoryLabel: 'Economy',
    categoryEmoji: '💱',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-13',
    slug: 'banks-open-march-31-government-business',
    title: 'RBI: Agency Banks to Remain Open on March 31',
    category: 'politics',
    status: 'upcoming',
    summary:
      'RBI directed agency banks handling government business to remain open on March 31, 2026 to ensure smooth year-end accounting and government transactions.',
    mckinseyAnalysis: [
      'Operational readiness: branch staffing, cash management, and digital uptime become critical on a holiday',
      'Improves FY closing accuracy for tax receipts and government payments',
      'Limited market impact but high consumer awareness relevance',
    ],
    predictionMarketAngle:
      'Will RBI extend similar special-opening instructions to banks on another FY-end holiday in 2026?',
    categoryLabel: 'Politics',
    categoryEmoji: '🗳️',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-14',
    slug: 'trai-1600-series-stockbrokers',
    title: 'TRAI: "1600" Verified Calling Series for Stockbrokers',
    category: 'politics',
    status: 'active',
    summary:
      'TRAI has set a deadline of March 15, 2026 for qualified stockbrokers to migrate to the 1600 numbering series to help users identify legitimate financial calls and reduce fraud.',
    mckinseyAnalysis: [
      'Fraud reduction: verified caller ID improves trust and reduces spoofing',
      'Compliance cost for brokers: systems and vendor integration',
      'Potential short-term disruption if migration is incomplete by deadline',
    ],
    predictionMarketAngle:
      'Will major brokers report a measurable drop in fraud complaints by end of April 2026 after 1600 rollout?',
    categoryLabel: 'Politics',
    categoryEmoji: '⚖️',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-15',
    slug: 'india-fta-eu-progress',
    title: 'India-EU Trade Talks: Breakthrough Signals',
    category: 'economy',
    status: 'active',
    summary:
      'Momentum on India-EU trade talks could reduce tariff uncertainty and attract manufacturing investment; final scope will determine sector winners/losers.',
    mckinseyAnalysis: [
      'Export upside in pharmaceuticals, textiles, engineering goods',
      'Import competition risks in autos, wines/spirits, and dairy depending on concessions',
      'Standards alignment (carbon border, data rules) may be binding constraints',
    ],
    predictionMarketAngle:
      'Will India and the EU announce an FTA framework agreement by Sep 30, 2026?',
    categoryLabel: 'Economy',
    categoryEmoji: '🤝',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-16',
    slug: 'india-us-tariff-reduction',
    title: 'US Tariff Reductions on Indian Goods',
    category: 'economy',
    status: 'active',
    summary:
      'Tariffs on some Indian goods reduced (reported from 50% to 18%) as part of trade deal framework; execution timelines and product coverage will determine real impact.',
    mckinseyAnalysis: [
      'Potential competitiveness boost for targeted export categories',
      'Risk of non-tariff barriers remaining high (compliance, standards)',
      'Watch for downstream supply-chain investment commitments',
    ],
    predictionMarketAngle:
      'Will India’s exports to the US grow faster than exports to the EU in FY27?',
    categoryLabel: 'Economy',
    categoryEmoji: '🇺🇸',
    updatedAt: '2026-03-13T19:00:00Z',
  },
  {
    id: 'evt-17',
    slug: 'fii-outflows-india-equities',
    title: 'Foreign Investor Outflows from Indian Equities',
    category: 'markets',
    status: 'active',
    summary:
      'Foreign investors have been reducing India exposure amid global risk-off sentiment and higher US yields; flows will influence INR, equity multiples and bond demand.',
    mckinseyAnalysis: [
      'Flow-driven selloffs can overshoot fundamentals, creating tactical entry points',
      'Domestic SIP flows provide partial buffer but may not absorb sharp spikes',
      'Higher crude amplifies macro risk premium and accelerates de-risking',
    ],
    predictionMarketAngle:
      'Will FIIs be net sellers in Indian equities for the full month of March 2026?',
    categoryLabel: 'Markets',
    categoryEmoji: '📊',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-18',
    slug: 'infrastructure-capex-push-budget-2026',
    title: 'Infrastructure Capex Push (Budget 2026)',
    category: 'politics',
    status: 'active',
    summary:
      'Union Budget 2026 continues capex-heavy growth strategy across infra and manufacturing; fiscal consolidation path and execution pace remain key watchpoints.',
    mckinseyAnalysis: [
      'Capex multiplier strongest in roads, rail, logistics, power T&D',
      'Execution risk: land, clearances, contractor capacity, state coordination',
      'Private sector crowd-in depends on policy certainty and credit availability',
    ],
    predictionMarketAngle:
      'Will FY27 central government capex exceed FY26 by at least 10%?',
    categoryLabel: 'Politics',
    categoryEmoji: '🏗️',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-19',
    slug: 'gdp-growth-tracking-2026',
    title: 'India Growth Outlook: 2026 Tracking',
    category: 'economy',
    status: 'active',
    summary:
      'India’s growth remains resilient, but investors are watching private capex, rural demand, and oil-linked inflation risks as key swing factors for FY26-FY27 trajectory.',
    mckinseyAnalysis: [
      'Government spending is a key near-term growth driver; private investment lag is a structural risk',
      'Rural demand recovery hinges on monsoon and food inflation normalization',
      'External shocks (oil, trade restrictions) are primary downside tail risks',
    ],
    predictionMarketAngle:
      'Will India FY26 real GDP growth print at or above 7.0%?',
    categoryLabel: 'Economy',
    categoryEmoji: '📈',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-20',
    slug: 'inflation-tracking-2026',
    title: 'India Inflation: CPI and Food Watch',
    category: 'economy',
    status: 'active',
    summary:
      'Inflation is below target but vulnerable to food and fuel shocks; CPI prints and food price interventions are key near-term market drivers.',
    mckinseyAnalysis: [
      'Food inflation volatility remains a political and policy sensitivity',
      'Fuel shocks can change RBI stance and bond yield trajectory quickly',
      'Supply-side interventions (imports, stock limits) can cap spikes but distort markets',
    ],
    predictionMarketAngle:
      'Will March 2026 CPI inflation print above 4.0% y/y?',
    categoryLabel: 'Economy',
    categoryEmoji: '📊',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-21',
    slug: 'oil-price-brent-100',
    title: 'Oil Price: Brent Above $100?',
    category: 'energy',
    status: 'critical',
    summary:
      'Oil prices have jumped on West Asia risk; the $100/bbl threshold is a key macro tipping point for India’s inflation and fiscal math.',
    mckinseyAnalysis: [
      'Above $100, India’s fuel pricing becomes politically sensitive; excise/subsidy risk rises',
      'CAD and INR pressure intensifies; RBI intervention probability increases',
      'Downstream impact on transport, aviation, chemicals and fertilizers',
    ],
    predictionMarketAngle:
      'Will Brent crude settle above $100/barrel for 5 consecutive trading days in March 2026?',
    categoryLabel: 'Energy',
    categoryEmoji: '🔥',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-22',
    slug: 'lng-lpg-supply-chain-risk',
    title: 'LNG/LPG Supply Chain Risk',
    category: 'energy',
    status: 'active',
    summary:
      'Tighter LNG/LPG supply and shipping risk in West Asia could raise gas prices and create localized shortages, affecting households and industry.',
    mckinseyAnalysis: [
      'Household LPG affordability is a key political sensitivity',
      'Fertilizer and city-gas distributors face margin pressure and demand destruction risk',
      'Diversification to US/Qatar/Australia supplies and strategic inventory are mitigants',
    ],
    predictionMarketAngle:
      'Will India announce additional LPG subsidy support before April 30, 2026?',
    categoryLabel: 'Energy',
    categoryEmoji: '⛽',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-23',
    slug: 'global-trade-disruptions-asia',
    title: 'Global Trade Disruptions: Shipping and Supply Chains',
    category: 'geopolitics',
    status: 'active',
    summary:
      'Red Sea/West Asia shipping risks continue to reroute trade flows, raising freight rates and delivery timelines for Indian exporters and importers.',
    mckinseyAnalysis: [
      'Higher freight rates compress exporter margins and may raise input inflation',
      'Sector impact: textiles, auto components, chemicals, electronics',
      'Mitigation via inventory build, near-shoring suppliers, alternative routes',
    ],
    predictionMarketAngle:
      'Will container freight rates remain elevated through Q2 2026?',
    categoryLabel: 'Geopolitics',
    categoryEmoji: '🌏',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-24',
    slug: 'ai-startup-funding-india-2026',
    title: 'AI Startup Funding in India: 2026 Watch',
    category: 'technology',
    status: 'active',
    summary:
      'AI startups are seeing selective funding as investors shift from growth-at-all-costs to unit-economics; government programs and corporate pilots are key catalysts.',
    mckinseyAnalysis: [
      'Deal count may rise even if ticket sizes shrink; consolidation likely',
      'B2B AI adoption depends on cloud budgets and data readiness',
      'Regulatory and data policy clarity is a key enabler',
    ],
    predictionMarketAngle:
      'Will India AI startups raise over $1B in total funding in H1 2026?',
    categoryLabel: 'Technology',
    categoryEmoji: '💻',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-25',
    slug: 'smartphone-launch-season-india-2026',
    title: 'Smartphone Launch Season: India 2026',
    category: 'technology',
    status: 'active',
    summary:
      'Major smartphone launches are driving upgrade cycles; pricing and import duties will affect demand and margins for OEMs and retailers.',
    mckinseyAnalysis: [
      'Premiumization trend continues in metros while price sensitivity remains in tier-2/3 cities',
      'Exchange offers and BNPL credit availability drive conversion',
      'Supply chain constraints and component costs remain swing factors',
    ],
    predictionMarketAngle:
      'Will India smartphone shipments grow year-on-year in Q2 2026?',
    categoryLabel: 'Technology',
    categoryEmoji: '📱',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-26',
    slug: 'semiconductor-incentives-india-2026',
    title: 'Semiconductor Incentives: Next Approvals',
    category: 'technology',
    status: 'active',
    summary:
      'Semiconductor incentives remain central to industrial policy; next approvals and project milestones will shape credibility and supply chain localization.',
    mckinseyAnalysis: [
      'Execution risk: timelines, technology partners, and capex financing',
      'Opportunity: job creation and export capability in electronics manufacturing',
      'Dependence on global semiconductor cycle and geopolitics remains high',
    ],
    predictionMarketAngle:
      'Will India approve at least one new semiconductor fab project by Sep 30, 2026?',
    categoryLabel: 'Technology',
    categoryEmoji: '⚡',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-27',
    slug: 'water-crisis-urban-india-2026',
    title: 'Urban Water Stress: 2026 Summer Risk',
    category: 'economy',
    status: 'active',
    summary:
      'Heat and water stress risks could disrupt urban supply and industrial operations; governance and infrastructure response will be tested in summer 2026.',
    mckinseyAnalysis: [
      'Water stress can hit industrial clusters and services reliability',
      'Political risk rises with tanker dependence and price spikes',
      'Capex in desalination, recycling, and leakage reduction is a multi-year opportunity',
    ],
    predictionMarketAngle:
      'Will any metro city in India declare a water emergency by May 31, 2026?',
    categoryLabel: 'Economy',
    categoryEmoji: '💧',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-28',
    slug: 'global-recession-risk-2026',
    title: 'Global Growth Slowdown Risk',
    category: 'geopolitics',
    status: 'active',
    summary:
      'Global growth concerns could reduce demand for Indian exports and increase risk-off flows; policy buffers and domestic demand are key stabilizers.',
    mckinseyAnalysis: [
      'Exports are sensitive to US/EU demand cycles',
      'Financial conditions tighten rapidly in risk-off episodes',
      'India’s domestic demand is a relative buffer but not fully decoupled',
    ],
    predictionMarketAngle:
      'Will the US economy enter recession in 2026 (as defined by NBER)?',
    categoryLabel: 'Geopolitics',
    categoryEmoji: '🌍',
    updatedAt: '2026-03-13T00:00:00Z',
  },
  {
    id: 'evt-29',
    slug: 'india-iran-escalation-risk',
    title: 'Iran Escalation Risk: Strait of Hormuz',
    category: 'geopolitics',
    status: 'critical',
    summary:
      'Escalation risk around Iran raises the tail scenario of disruptions near the Strait of Hormuz, which would be a severe shock for global oil and India’s macro stability.',
    mckinseyAnalysis: [
      'Hormuz disruption is a low-probability, high-impact scenario for India',
      'India may need strategic petroleum reserve releases and emergency import diversification',
      'Defense and diplomacy posture becomes market-relevant in a crisis',
    ],
    predictionMarketAngle:
      'Will there be any reported closure/disruption of the Strait of Hormuz in March 2026?',
    categoryLabel: 'Geopolitics',
    categoryEmoji: '⚠️',
    updatedAt: '2026-03-13T00:00:00Z',
  },
];
