import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hivvemtveyjexrwgruhs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdnZlbXR2ZXlqZXhyd2dydWhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM0MTQ3NCwiZXhwIjoyMDg4OTE3NDc0fQ.P7MvIzW6aY5I5dMUTKDy7Y2ZmPG_Ei506WCukH8kFkc'
);

// Create table via REST API using raw SQL
try {
  const res = await fetch('https://hivvemtveyjexrwgruhs.supabase.co/rest/v1/rpc/exec_sql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdnZlbXR2ZXlqZXhyd2dydWhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM0MTQ3NCwiZXhwIjoyMDg4OTE3NDc0fQ.P7MvIzW6aY5I5dMUTKDy7Y2ZmPG_Ei506WCukH8kFkc',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdnZlbXR2ZXlqZXhyd2dydWhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM0MTQ3NCwiZXhwIjoyMDg4OTE3NDc0fQ.P7MvIzW6aY5I5dMUTKDy7Y2ZmPG_Ei506WCukH8kFkc'
    },
    body: JSON.stringify({ sql: `CREATE TABLE IF NOT EXISTS public.trending_events_cache (id text PRIMARY KEY, slug text NOT NULL, title text NOT NULL, category text NOT NULL, status text NOT NULL DEFAULT 'active', summary text NOT NULL, image_url text, data jsonb NOT NULL, source_url text, scraped_at timestamptz NOT NULL DEFAULT now())` })
  });
  console.log('Table creation attempt:', res.status);
} catch (e) {
  console.log('Table creation skipped (may already exist)');
}

const now = new Date().toISOString();

const events = [
  // MARKETS
  {
    id: 'evt-scrape-markets-1',
    slug: 'bears-drag-nifty-below-22850-sensex-tanks-1690',
    title: 'Bears drag Nifty below 22,850; Sensex tanks 1,690 pts',
    category: 'markets',
    status: 'active',
    summary: 'The Indian stock markets faced significant losses, with Sensex plunging nearly 1,700 points and Nifty settling below 22,850. Bearish sentiment and geopolitical tensions caused the rupee to weaken to a record low.',
    image_url: 'https://images.moneycontrol.com/static-mcnews/2026/03/20260327090352_fall.jpeg',
    source_url: 'https://www.moneycontrol.com/stocksmarketsindia/',
    data: {
      id: 'evt-scrape-markets-1', slug: 'bears-drag-nifty-below-22850-sensex-tanks-1690',
      title: 'Bears drag Nifty below 22,850; Sensex tanks 1,690 pts', category: 'markets', status: 'active',
      summary: 'The Indian stock markets faced significant losses, with Sensex plunging nearly 1,700 points and Nifty settling below 22,850. Bearish sentiment and geopolitical tensions caused the rupee to weaken to a record low.',
      imageUrl: 'https://images.moneycontrol.com/static-mcnews/2026/03/20260327090352_fall.jpeg',
      keyDrivers: ['Geopolitical tensions impacting investor sentiment', 'Falling crude oil prices affecting market stability', 'Weakening of the Indian rupee against the dollar'],
      mckinseyAnalysis: ['Market downturn reflects heightened anxiety over global economic conditions', 'Investor confidence may take longer to recover amidst ongoing uncertainties', 'Falling indices could lead to increased volatility in the near future'],
      predictionMarketAngle: 'Will the Indian stock market recover above 23,500 by end of April 2026?',
      categoryLabel: 'Markets', categoryEmoji: '📉', updatedAt: now
    }
  },
  {
    id: 'evt-scrape-markets-2',
    slug: 'indian-stock-market-weekly-outlook-us-iran',
    title: 'Indian Stock Market Weekly Outlook Amid US-Iran Tensions',
    category: 'markets',
    status: 'upcoming',
    summary: 'Sensex and Nifty 50 both fell over 2% on Friday. Geopolitical tensions, high crude oil prices, and foreign fund outflows contributed to a volatile trading environment.',
    image_url: 'https://www.livemint.com/lm-img/img/2026/03/29/600x338/stock_1774766653260_1774766653386.jpg',
    source_url: 'https://www.livemint.com/market/stock-market-news/',
    data: {
      id: 'evt-scrape-markets-2', slug: 'indian-stock-market-weekly-outlook-us-iran',
      title: 'Indian Stock Market Weekly Outlook Amid US-Iran Tensions', category: 'markets', status: 'upcoming',
      summary: 'Sensex and Nifty 50 both fell over 2% on Friday. Geopolitical tensions, high crude oil prices, and foreign fund outflows contributed to a volatile trading environment.',
      imageUrl: 'https://www.livemint.com/lm-img/img/2026/03/29/600x338/stock_1774766653260_1774766653386.jpg',
      keyDrivers: ['Geopolitical tensions', 'Elevated crude oil prices', 'Foreign fund outflows', 'Investor sentiment', 'Market volatility'],
      mckinseyAnalysis: ['Ongoing geopolitical tensions may lead to continued volatility', 'High crude prices will impact inflation and consumer spending', 'Investor caution and foreign outflows could hinder domestic investments'],
      predictionMarketAngle: 'Will the Indian stock market stabilize next week amid ongoing geopolitical tensions?',
      categoryLabel: 'Markets', categoryEmoji: '📉', updatedAt: now
    }
  },
  // POLITICS
  {
    id: 'evt-scrape-politics-1',
    slug: '2026-bengal-election-breaking-federalism',
    title: 'Why The 2026 Bengal Election Is Breaking Federalism',
    category: 'politics',
    status: 'active',
    summary: 'The 2026 West Bengal Assembly election is a significant event affecting Indian federalism, with a 16% decrease in the electorate and the Supreme Court intervening in voter list management.',
    image_url: 'https://i.ytimg.com/vi/KOdLTV5KODw/maxresdefault.jpg',
    source_url: 'https://www.youtube.com/watch?v=KOdLTV5KODw',
    data: {
      id: 'evt-scrape-politics-1', slug: '2026-bengal-election-breaking-federalism',
      title: 'Why The 2026 Bengal Election Is Breaking Federalism', category: 'politics', status: 'active',
      summary: 'The 2026 West Bengal Assembly election is a significant event affecting Indian federalism, with a 16% decrease in the electorate and the Supreme Court intervening in voter list management.',
      imageUrl: 'https://i.ytimg.com/vi/KOdLTV5KODw/maxresdefault.jpg',
      keyDrivers: ['Decreased electorate size', "Supreme Court's intervention on voter lists", 'Political implications for federalism'],
      mckinseyAnalysis: ['Role of state elections in shaping federal dynamics', 'Impact of Supreme Court involvement on electoral integrity', 'Shifts in voter base and political party strategies'],
      predictionMarketAngle: 'Will TMC retain power in West Bengal 2026 elections?',
      categoryLabel: 'Politics', categoryEmoji: '🗳️', updatedAt: now
    }
  },
  // SPORTS
  {
    id: 'evt-scrape-sports-1',
    slug: 'ipl-2026-mi-vs-kkr-match-report',
    title: 'TATA IPL 2026 Match 2: MI vs KKR',
    category: 'sports',
    status: 'active',
    summary: 'Mumbai Indians face Kolkata Knight Riders in the second match of IPL 2026. Key player performances and strategic decisions by coaches drive the excitement.',
    image_url: 'https://documents.iplt20.com/bcci/articles/1774808035_RJV000585.jpg',
    source_url: 'https://www.iplt20.com/news',
    data: {
      id: 'evt-scrape-sports-1', slug: 'ipl-2026-mi-vs-kkr-match-report',
      title: 'TATA IPL 2026 Match 2: MI vs KKR', category: 'sports', status: 'active',
      summary: 'Mumbai Indians face Kolkata Knight Riders in the second match of IPL 2026. Key player performances and strategic decisions by coaches drive the excitement.',
      imageUrl: 'https://documents.iplt20.com/bcci/articles/1774808035_RJV000585.jpg',
      keyDrivers: ['Performance of key players', 'Match conditions', 'Strategic decisions by coaches'],
      mckinseyAnalysis: ['Impact of player injuries on tournament outcomes', 'Audience engagement strategies evolving', 'Revenue implications for franchises'],
      predictionMarketAngle: 'Will Mumbai Indians finish in the top 4 of IPL 2026?',
      categoryLabel: 'Sports', categoryEmoji: '🏏', updatedAt: now
    }
  },
  {
    id: 'evt-scrape-sports-2',
    slug: 'rcb-defeats-srh-ipl-2026-opener',
    title: 'IPL 2026: RCB Defeats SRH in Record-Breaking Season Opener',
    category: 'sports',
    status: 'active',
    summary: 'Royal Challengers Bengaluru started IPL 2026 with a six-wicket victory over Sunrisers Hyderabad. Virat Kohli scored unbeaten 69, Devdutt Padikkal hit 61 off 26 balls, chasing 202 in just 15.4 overs — the fastest 200+ chase in IPL history.',
    image_url: 'https://c.ndtvimg.com/2026-03/piqrac74_devdutt-padikkal-virat-kohli-bcci_625x300_28_March_26.jpg',
    source_url: 'https://sports.ndtv.com/ipl-2026/news',
    data: {
      id: 'evt-scrape-sports-2', slug: 'rcb-defeats-srh-ipl-2026-opener',
      title: 'IPL 2026: RCB Defeats SRH in Record-Breaking Season Opener', category: 'sports', status: 'active',
      summary: 'Royal Challengers Bengaluru started IPL 2026 with a six-wicket victory over Sunrisers Hyderabad. Virat Kohli scored unbeaten 69, Devdutt Padikkal hit 61 off 26 balls, chasing 202 in just 15.4 overs — the fastest 200+ chase in IPL history.',
      imageUrl: 'https://c.ndtvimg.com/2026-03/piqrac74_devdutt-padikkal-virat-kohli-bcci_625x300_28_March_26.jpg',
      keyDrivers: ["Virat Kohli's strong performance with 69 not out", "Devdutt Padikkal's rapid 61 runs", "RCB's dominant chase in 15.4 overs"],
      mckinseyAnalysis: ['RCB showcased tactical superiority over SRH', "Effectiveness of RCB's batting lineup demonstrated", 'Strategic gameplay was pivotal in the victory'],
      predictionMarketAngle: 'Will RCB win the IPL 2026 title?',
      categoryLabel: 'Sports', categoryEmoji: '🏏', updatedAt: now
    }
  },
  // GEOPOLITICS
  {
    id: 'evt-scrape-geopolitics-1',
    slug: 'iran-war-shift-india-grand-strategy',
    title: "Has the Iran War Revealed a Shift in India's Grand Strategy?",
    category: 'geopolitics',
    status: 'active',
    summary: "India's recent geopolitical stance in the Middle East indicates a potential pivot in foreign policy, moving towards tacit support for the U.S. and Israel instead of promoting multipolarity.",
    image_url: 'https://thediplomat.com/wp-content/uploads/2025/12/sizes/td-story-s-2/thediplomat_2025-12-31-185402.webp',
    source_url: 'https://thediplomat.com/2026/03/has-the-iran-war-revealed-a-shift-in-indias-grand-strategy/',
    data: {
      id: 'evt-scrape-geopolitics-1', slug: 'iran-war-shift-india-grand-strategy',
      title: "Has the Iran War Revealed a Shift in India's Grand Strategy?", category: 'geopolitics', status: 'active',
      summary: "India's recent geopolitical stance in the Middle East indicates a potential pivot in foreign policy, moving towards tacit support for the U.S. and Israel instead of promoting multipolarity.",
      imageUrl: 'https://thediplomat.com/wp-content/uploads/2025/12/sizes/td-story-s-2/thediplomat_2025-12-31-185402.webp',
      keyDrivers: ['India remaining neutral yet tacitly supporting U.S. and Israel', 'Historical reluctance to denounce American actions', 'Changes in strategic priorities related to U.S.-India relations'],
      mckinseyAnalysis: ['Shift from promoting multipolarity to potentially supporting U.S. hegemony', 'Geopolitical scenario may force India to reconsider its relationships', "Internal struggle between historical foreign policy and present-day strategic calculations"],
      predictionMarketAngle: 'Will India formally align with the US position on the Iran conflict by mid-2026?',
      categoryLabel: 'Geopolitics', categoryEmoji: '🌍', updatedAt: now
    }
  },
  {
    id: 'evt-scrape-geopolitics-2',
    slug: 'iran-war-puts-india-tricky-position',
    title: 'Iran War Puts India in Tricky Position',
    category: 'geopolitics',
    status: 'active',
    summary: "India faces critical challenges as U.S.-India relations strain amid the Iran war. U.S. officials emphasize 'America First' stance, leading to discontent within India.",
    image_url: 'https://foreignpolicy.com/wp-content/uploads/2026/03/india-shia-khamenei-GettyImages-2265831092.jpg',
    source_url: 'https://foreignpolicy.com/2026/03/13/india-iran-war-us-trump-landau-ship-sinking/',
    data: {
      id: 'evt-scrape-geopolitics-2', slug: 'iran-war-puts-india-tricky-position',
      title: 'Iran War Puts India in Tricky Position', category: 'geopolitics', status: 'active',
      summary: "India faces critical challenges as U.S.-India relations strain amid the Iran war. U.S. officials emphasize 'America First' stance, leading to discontent within India.",
      imageUrl: 'https://foreignpolicy.com/wp-content/uploads/2026/03/india-shia-khamenei-GettyImages-2265831092.jpg',
      keyDrivers: ['U.S.-India relations', 'Iran war implications', 'Domestic dissent in India', 'Economic ties with Iran', 'Political opposition to U.S. policies'],
      mckinseyAnalysis: ["War in Iran affects India's strategic positioning with the U.S.", "Landau's 'America First' comments rekindled fears about U.S. intentions", 'Political backlash highlights internal divisions'],
      predictionMarketAngle: 'Will U.S.-India relations deteriorate further due to the Iran conflict?',
      categoryLabel: 'Geopolitics', categoryEmoji: '🌍', updatedAt: now
    }
  },
  {
    id: 'evt-scrape-geopolitics-3',
    slug: 'us-iran-war-worst-geopolitical-scenario-india',
    title: 'Is the US-Iran War the Worst Geopolitical Scenario for India?',
    category: 'geopolitics',
    status: 'critical',
    summary: 'The US-Iran war poses severe risks for India — energy supplies through Hormuz, Chabahar Port, and nine million Indians in the Gulf are all threatened.',
    image_url: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/202603/iran-bombing-continues--india-sees-first-casualty-as-middle-east-war-enters-day-3-02021726-16x9_1.jpg',
    source_url: 'https://www.indiatoday.in/world/story/is-the-us-iran-war-the-worst-possible-geopolitical-scenario-for-india-2877217-2026-03-04',
    data: {
      id: 'evt-scrape-geopolitics-3', slug: 'us-iran-war-worst-geopolitical-scenario-india',
      title: 'Is the US-Iran War the Worst Geopolitical Scenario for India?', category: 'geopolitics', status: 'critical',
      summary: 'The US-Iran war poses severe risks for India — energy supplies through Hormuz, Chabahar Port, and nine million Indians in the Gulf are all threatened.',
      imageUrl: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/202603/iran-bombing-continues--india-sees-first-casualty-as-middle-east-war-enters-day-3-02021726-16x9_1.jpg',
      keyDrivers: ['Threat to energy supplies through Strait of Hormuz', 'Impact on Chabahar Port development', 'Economic strain from rising oil prices', 'Safety of Indian citizens in Gulf countries'],
      mckinseyAnalysis: ['India imports 85-90% of its oil, with significant quantities passing through Hormuz', 'Rising oil prices adversely affect economy, increasing current account deficit and inflation', 'Strategic projects like Chabahar are jeopardized due to escalating conflict'],
      predictionMarketAngle: 'Will crude oil prices stay above $100/barrel through Q2 2026?',
      categoryLabel: 'Geopolitics', categoryEmoji: '🌍', updatedAt: now
    }
  },
  // TECHNOLOGY
  {
    id: 'evt-scrape-technology-1',
    slug: 'indian-startups-raise-9-billion-ai-deeptech',
    title: 'Indian Startups Raise $9.1B as AI Drives 91% of Deeptech Investments',
    category: 'technology',
    status: 'active',
    summary: 'Indian technology startups raised $9.1 billion in 2025, a 23% YoY increase. AI emerged as the core driver, accounting for 91% of deeptech funding. Early-stage deals remain robust at 74% of total.',
    image_url: 'https://asset.peoplematters.in/images/4139ac0f-cc8b-4f36-8c47-e2c340bf4a1f.jpg',
    source_url: 'https://www.peoplematters.in/news/funding-and-investment/indian-startups-raise-dollar91-billion-as-ai-drives-91percent-of-deeptech-investments-48970',
    data: {
      id: 'evt-scrape-technology-1', slug: 'indian-startups-raise-9-billion-ai-deeptech',
      title: 'Indian Startups Raise $9.1B as AI Drives 91% of Deeptech Investments', category: 'technology', status: 'active',
      summary: 'Indian technology startups raised $9.1 billion in 2025, a 23% YoY increase. AI emerged as the core driver, accounting for 91% of deeptech funding.',
      imageUrl: 'https://asset.peoplematters.in/images/4139ac0f-cc8b-4f36-8c47-e2c340bf4a1f.jpg',
      keyDrivers: ['AI as the core driver of funding', 'Surge in early-stage deals', 'Growth in mergers and acquisitions', 'Selective capital deployment'],
      mckinseyAnalysis: ['Deeptech funding surged 37% to $2.3 billion in 2025', 'Investors focusing on scalable, commercialisation-ready ventures', 'Ecosystem transitioning from growth-at-all-costs to performance-led scaling'],
      predictionMarketAngle: 'Will Indian startup funding exceed $10 billion in 2026?',
      categoryLabel: 'Technology', categoryEmoji: '💻', updatedAt: now
    }
  },
  {
    id: 'evt-scrape-technology-2',
    slug: 'ai-funding-fewer-deals-larger-cheques',
    title: 'AI Funding: Fewer Deals, Larger Cheques',
    category: 'technology',
    status: 'active',
    summary: 'Just 14 AI startups raised $674 million in Q1 2026. Neysa alone collected ~$600 million. Investor preference has shifted toward infrastructure platforms supporting AI.',
    image_url: 'https://images.financialexpressdigital.com/2026/03/artificial-intelligence-1_20260214151410_20260219160649_20260225173837_20260329180046.jpg',
    source_url: 'https://www.financialexpress.com/business/news/ai-funding-fewer-deals-larger-cheques/4188512/',
    data: {
      id: 'evt-scrape-technology-2', slug: 'ai-funding-fewer-deals-larger-cheques',
      title: 'AI Funding: Fewer Deals, Larger Cheques', category: 'technology', status: 'active',
      summary: 'Just 14 AI startups raised $674 million in Q1 2026. Neysa alone collected ~$600 million. Investor preference has shifted toward infrastructure platforms.',
      imageUrl: 'https://images.financialexpressdigital.com/2026/03/artificial-intelligence-1_20260214151410_20260219160649_20260225173837_20260329180046.jpg',
      keyDrivers: ['Concentration of funding in fewer companies', 'Growth in infrastructure-led bets', 'Increased investor interest in AI tools'],
      mckinseyAnalysis: ['AI funding increasingly concentrated among fewer companies', 'Consumer-focused AI innovations indicate a new phase', 'Long-term growth potential for infrastructure-oriented startups'],
      predictionMarketAngle: 'Will an Indian AI startup achieve unicorn status in Q2 2026?',
      categoryLabel: 'Technology', categoryEmoji: '💻', updatedAt: now
    }
  },
  // ENTERTAINMENT
  {
    id: 'evt-scrape-entertainment-1',
    slug: 'bollywood-box-office-2026-dhurandhar-blockbuster',
    title: 'Bollywood Box Office 2026: Dhurandhar 2 Achieves All-Time Blockbuster',
    category: 'entertainment',
    status: 'active',
    summary: 'Dhurandhar 2 achieved Super Duper Hit status with worldwide collection of ₹1365 Cr. The Bollywood film industry shows strong recovery with multiple successful releases in 2026.',
    image_url: 'https://www.koimoi.com/wp-content/new-galleries/2026/03/bollywood-box-office-collection-verdicts-01.jpg',
    source_url: 'https://www.koimoi.com/box-office/hits-flops/bollywood-box-office-collection-verdicts/',
    data: {
      id: 'evt-scrape-entertainment-1', slug: 'bollywood-box-office-2026-dhurandhar-blockbuster',
      title: 'Bollywood Box Office 2026: Dhurandhar 2 Achieves All-Time Blockbuster', category: 'entertainment', status: 'active',
      summary: 'Dhurandhar 2 achieved Super Duper Hit status with worldwide collection of ₹1365 Cr. The Bollywood film industry shows strong recovery.',
      imageUrl: 'https://www.koimoi.com/wp-content/new-galleries/2026/03/bollywood-box-office-collection-verdicts-01.jpg',
      keyDrivers: ['Dhurandhar 2 massive ₹1365 Cr worldwide collection', 'Rising trend in box office collections', 'Star power driving audience engagement'],
      mckinseyAnalysis: ['Rising collections indicate growing recovery in Bollywood post-pandemic', 'Audience preferences and spending behavior are shifting', 'Regional cinema blending with Bollywood dominance'],
      predictionMarketAngle: 'Will any Bollywood film cross ₹1500 Cr worldwide in 2026?',
      categoryLabel: 'Entertainment', categoryEmoji: '🎬', updatedAt: now
    }
  },
  // ENERGY
  {
    id: 'evt-scrape-energy-1',
    slug: 'india-oil-60-days-lpg-month-centre',
    title: 'India Has Oil for 60 Days, LPG for a Month: Centre',
    category: 'energy',
    status: 'active',
    summary: 'The Ministry of Petroleum assured India has sufficient oil reserves for 60 days and LPG for a month, dismissing shortage claims as misinformation amid West Asia tensions.',
    image_url: 'https://th-i.thgim.com/public/incoming/npcx8i/article70787592.ece/alternates/LANDSCAPE_1200/05-West%20Asia%20conflict%20Fuel%20shortage%20rumours-SGR-26-03-2026.JPG',
    source_url: 'https://www.thehindu.com/business/Economy/west-asia-conflict-india-petrol-diesel-lpg-crisis-ministry-of-petroleum-and-natural-gas/article70787555.ece',
    data: {
      id: 'evt-scrape-energy-1', slug: 'india-oil-60-days-lpg-month-centre',
      title: 'India Has Oil for 60 Days, LPG for a Month: Centre', category: 'energy', status: 'active',
      summary: 'The Ministry of Petroleum assured India has sufficient oil reserves for 60 days and LPG for a month, dismissing shortage claims as misinformation.',
      imageUrl: 'https://th-i.thgim.com/public/incoming/npcx8i/article70787592.ece/alternates/LANDSCAPE_1200/05-West%20Asia%20conflict%20Fuel%20shortage%20rumours-SGR-26-03-2026.JPG',
      keyDrivers: ['India has arranged a month of LPG supplies via imports', 'Fuel storage capacity increased from 50 to 60 days', 'Government combating misinformation about shortages'],
      mckinseyAnalysis: ['Fuel storage capacity has increased amid West Asian tensions', 'Government emphasizes self-sufficiency in LPG production', 'Future procurement of crude oil secured for coming months'],
      predictionMarketAngle: 'Will India face fuel rationing due to the Middle East crisis?',
      categoryLabel: 'Energy', categoryEmoji: '⛽', updatedAt: now
    }
  },
  {
    id: 'evt-scrape-energy-2',
    slug: 'rising-crude-threatens-india-economy-food-prices',
    title: "Rising Crude Threatens India's Economy and Food Prices",
    category: 'energy',
    status: 'critical',
    summary: 'Concerns mount over crude oil prices potentially surging towards $200/barrel. Experts warn direct effects on agriculture via increased fertilizer costs could lead to food inflation.',
    image_url: 'https://i.ytimg.com/vi/dxe-T7ChPY0/maxresdefault.jpg',
    source_url: 'https://www.reuters.com/business/energy/how-persistently-high-oil-prices-could-impact-indias-vulnerable-economy-2026-03-12/',
    data: {
      id: 'evt-scrape-energy-2', slug: 'rising-crude-threatens-india-economy-food-prices',
      title: "Rising Crude Threatens India's Economy and Food Prices", category: 'energy', status: 'critical',
      summary: 'Concerns mount over crude oil prices potentially surging towards $200/barrel. Experts warn direct effects on agriculture via increased fertilizer costs could lead to food inflation.',
      imageUrl: 'https://i.ytimg.com/vi/dxe-T7ChPY0/maxresdefault.jpg',
      keyDrivers: ['Global tensions disrupting energy markets', 'Rising crude oil prices', 'Impact on fertilizer and chemical costs', 'Food inflation risks', 'Pressure on GDP outlook for FY27'],
      mckinseyAnalysis: ['Inflation and currency stability concerns rising', 'Increased pressure on corporate earnings in energy-intensive sectors', 'Government measures to shield consumers may not be sustainable'],
      predictionMarketAngle: 'Will crude oil prices reach $150/barrel by mid-2026?',
      categoryLabel: 'Energy', categoryEmoji: '⛽', updatedAt: now
    }
  },
  // REGULATION
  {
    id: 'evt-scrape-regulation-1',
    slug: 'india-defi-regulatory-framework-compliance',
    title: 'Building for Compliance: Aligning DeFi with India\'s Regulatory Framework',
    category: 'regulation',
    status: 'active',
    summary: 'The Ministry of Finance initiated a regulatory framework for virtual assets through the PMLA VASP Notification, classifying entities providing services related to virtual assets as reporting entities.',
    image_url: null,
    source_url: 'https://www.globallegalinsights.com/practice-areas/blockchain-cryptocurrency-laws-and-regulations/india/',
    data: {
      id: 'evt-scrape-regulation-1', slug: 'india-defi-regulatory-framework-compliance',
      title: 'Building for Compliance: Aligning DeFi with India\'s Regulatory Framework', category: 'regulation', status: 'active',
      summary: 'The Ministry of Finance initiated a regulatory framework for virtual assets through the PMLA VASP Notification.',
      keyDrivers: ['PMLA VASP Notification', 'Regulatory clarity for Virtual Digital Asset Service Providers', 'Compliance obligations for DeFi projects', 'Enforcement actions against non-compliant entities'],
      mckinseyAnalysis: ['Shift from observation to active regulation in virtual asset space', 'Need for enhanced compliance structures for DeFi models', 'Increasing regulatory scrutiny on both centralized and decentralized platforms'],
      predictionMarketAngle: 'Will India pass comprehensive crypto regulation by end of 2026?',
      categoryLabel: 'Regulation', categoryEmoji: '⚖️', updatedAt: now
    }
  },
  {
    id: 'evt-scrape-regulation-2',
    slug: 'india-plans-crypto-exchange-regulations-budget-2026',
    title: 'India Plans Crypto Exchange Regulations Ahead of Budget 2026-27',
    category: 'regulation',
    status: 'upcoming',
    summary: 'The Ministry of Finance is in discussions with SEBI and RBI to establish a regulatory framework for cryptocurrency exchanges. SEBI is likely to become the primary regulator.',
    image_url: 'https://im.rediff.com/getahead/2025/mar/18crypto.jpg',
    source_url: 'https://www.rediff.com/business/report/budget-2026-regulatory-framework-for-crypto-exchanges-on-cards/20260127.htm',
    data: {
      id: 'evt-scrape-regulation-2', slug: 'india-plans-crypto-exchange-regulations-budget-2026',
      title: 'India Plans Crypto Exchange Regulations Ahead of Budget 2026-27', category: 'regulation', status: 'upcoming',
      summary: 'The Ministry of Finance is in discussions with SEBI and RBI to establish a regulatory framework for cryptocurrency exchanges.',
      imageUrl: 'https://im.rediff.com/getahead/2025/mar/18crypto.jpg',
      keyDrivers: ['Risks related to money laundering and terror financing', 'Lack of a single market regulator', 'Need for investor protection and real-time oversight', 'Compliance challenges with existing tax measures'],
      mckinseyAnalysis: ['Policymakers view absence of single regulator as a gap', 'Enforcement challenges due to anonymous offshore transactions', 'Existing tax frameworks do not adequately cover market conduct'],
      predictionMarketAngle: 'Will SEBI become the primary crypto regulator in India by 2027?',
      categoryLabel: 'Regulation', categoryEmoji: '⚖️', updatedAt: now
    }
  }
];

console.log(`Processing ${events.length} events...`);

// 1. Write to local JSON file (always works)
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(__dirname, '..', 'public', 'data', 'scraped-events.json');
const jsonData = events.map(e => e.data);
writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
console.log(`Wrote ${events.length} events to ${jsonPath}`);

// 2. Try Supabase upsert (may fail if table doesn't exist)
const { data, error } = await supabase
  .from('trending_events_cache')
  .upsert(events.map(e => ({ ...e, scraped_at: now })), { onConflict: 'id' });

if (error) {
  console.log('Supabase upsert skipped:', error.message);
  console.log('(Run the migration in Supabase Dashboard to enable DB storage)');
} else {
  console.log(`Also upserted ${events.length} events to Supabase!`);
}

// 3. Update metadata
const { error: metaErr } = await supabase
  .from('polymarket_meta')
  .upsert([
    { key: 'last_events_scrape', value: now, updated_at: now },
    { key: 'total_scraped_events', value: String(events.length), updated_at: now },
  ], { onConflict: 'key' });

if (metaErr) console.log('Meta update note:', metaErr.message);
else console.log('Metadata updated.');
