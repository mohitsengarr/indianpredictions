export interface ProbabilityPoint {
  date: string;
  probability: number;
  annotation?: string;
}

export interface EventDriver {
  date: string;
  driver: string;
  impact: 'positive' | 'negative' | 'neutral';
  magnitude: number;
  description: string;
}

export interface EventHistory {
  eventId: string;
  probabilityHistory: ProbabilityPoint[];
  keyDrivers: EventDriver[];
}

export const EVENT_HISTORIES: EventHistory[] = [
  {
    eventId: 'evt-1',
    probabilityHistory: [
      { date: 'Jan 1', probability: 12 },
      { date: 'Jan 15', probability: 15 },
      { date: 'Feb 1', probability: 18 },
      { date: 'Feb 10', probability: 22, annotation: 'FII outflows begin' },
      { date: 'Feb 20', probability: 35 },
      { date: 'Mar 1', probability: 48, annotation: 'Oil crosses $95' },
      { date: 'Mar 5', probability: 62 },
      { date: 'Mar 8', probability: 78, annotation: 'West Asia strikes' },
      { date: 'Mar 10', probability: 82 },
      { date: 'Mar 12', probability: 85, annotation: 'Oil past $101' },
      { date: 'Mar 13', probability: 85 },
    ],
    keyDrivers: [
      { date: 'Feb 10', driver: 'FII Outflows Accelerate', impact: 'negative', magnitude: 8, description: 'Foreign institutional investors pulled ₹12,000 Cr from Indian equities in a single week' },
      { date: 'Mar 1', driver: 'Crude Oil Crosses $95', impact: 'negative', magnitude: 9, description: 'Brent crude surged past $95 on supply disruption fears from Middle East tensions' },
      { date: 'Mar 8', driver: 'US-Israel Airstrikes on Iran', impact: 'negative', magnitude: 10, description: 'Major escalation in West Asia triggered global risk-off sentiment' },
      { date: 'Mar 10', driver: 'Rupee Hits All-Time Low', impact: 'negative', magnitude: 7, description: 'INR/USD breached 87.40 as capital flight intensified' },
      { date: 'Mar 12', driver: 'Oil Crosses $101/barrel', impact: 'negative', magnitude: 9, description: 'Crude oil surge raises India current account deficit and fiscal concerns' },
    ],
  },
  {
    eventId: 'evt-2',
    probabilityHistory: [
      { date: 'Jan 1', probability: 25 },
      { date: 'Jan 15', probability: 28 },
      { date: 'Feb 1', probability: 32, annotation: 'RBI holds at 5.25%' },
      { date: 'Feb 10', probability: 35 },
      { date: 'Feb 20', probability: 38 },
      { date: 'Mar 1', probability: 42, annotation: 'Inflation at 2.1%' },
      { date: 'Mar 5', probability: 44 },
      { date: 'Mar 8', probability: 40, annotation: 'Oil spike complicates outlook' },
      { date: 'Mar 10', probability: 42 },
      { date: 'Mar 13', probability: 45 },
    ],
    keyDrivers: [
      { date: 'Feb 1', driver: 'RBI Holds Repo Rate at 5.25%', impact: 'neutral', magnitude: 6, description: 'MPC voted unanimously to maintain neutral stance amid global uncertainty' },
      { date: 'Mar 1', driver: 'CPI Inflation Falls to 2.1%', impact: 'positive', magnitude: 8, description: 'Inflation well below 4% target opens room for potential rate cuts' },
      { date: 'Mar 8', driver: 'Oil Price Spike', impact: 'negative', magnitude: 7, description: 'Crude oil surge threatens to push inflation higher, complicating RBI rate cut calculus' },
      { date: 'Mar 13', driver: 'Goldman Sachs Maintains Growth Forecast', impact: 'positive', magnitude: 5, description: 'Goldman keeps India 2026 growth at 6.9%, supporting accommodative monetary policy stance' },
    ],
  },
  {
    eventId: 'evt-7',
    probabilityHistory: [
      { date: 'Jan 1', probability: 92 },
      { date: 'Jan 15', probability: 90 },
      { date: 'Feb 1', probability: 88 },
      { date: 'Feb 15', probability: 85, annotation: 'Election schedule overlap' },
      { date: 'Mar 1', probability: 80 },
      { date: 'Mar 5', probability: 75, annotation: 'LPG shortage concerns' },
      { date: 'Mar 8', probability: 70, annotation: 'West Asia escalation' },
      { date: 'Mar 10', probability: 72 },
      { date: 'Mar 13', probability: 72 },
    ],
    keyDrivers: [
      { date: 'Feb 15', driver: 'Election Schedule Overlap', impact: 'negative', magnitude: 5, description: 'BCCI coordinating with Election Commission on venues due to state elections' },
      { date: 'Mar 5', driver: 'LPG Shortage Concerns', impact: 'negative', magnitude: 6, description: 'West Asia tensions causing LPG supply disruptions across India, logistical concerns for venues' },
      { date: 'Mar 8', driver: 'West Asia Escalation', impact: 'negative', magnitude: 7, description: 'Heightened security concerns and potential travel disruptions affecting IPL planning' },
      { date: 'Mar 10', driver: 'BCCI Confirms Schedule', impact: 'positive', magnitude: 4, description: 'BCCI reaffirms March 28 start date for RCB vs SRH opening match' },
    ],
  },
  {
    eventId: 'evt-9',
    probabilityHistory: [
      { date: 'Jan 1', probability: 15 },
      { date: 'Jan 15', probability: 18 },
      { date: 'Feb 1', probability: 20 },
      { date: 'Feb 15', probability: 22 },
      { date: 'Mar 1', probability: 18, annotation: 'Diplomatic channels open' },
      { date: 'Mar 5', probability: 15 },
      { date: 'Mar 8', probability: 8, annotation: 'Major airstrikes' },
      { date: 'Mar 10', probability: 12 },
      { date: 'Mar 13', probability: 22 },
    ],
    keyDrivers: [
      { date: 'Mar 1', driver: 'Diplomatic Channels Open', impact: 'positive', magnitude: 4, description: 'Back-channel negotiations reported between US and Iran via intermediaries' },
      { date: 'Mar 8', driver: 'Major US-Israel Airstrikes', impact: 'negative', magnitude: 10, description: 'Among most intense military actions of the ongoing conflict, ceasefire prospects dim' },
      { date: 'Mar 10', driver: 'UN Security Council Emergency Session', impact: 'positive', magnitude: 3, description: 'Emergency session called, though veto expected from US' },
      { date: 'Mar 13', driver: 'Ceasefire Talk Signals', impact: 'positive', magnitude: 5, description: 'Reports of indirect negotiations resuming through Oman mediation' },
    ],
  },
  {
    eventId: 'evt-5',
    probabilityHistory: [
      { date: 'Jan 1', probability: 35 },
      { date: 'Jan 15', probability: 37 },
      { date: 'Feb 1', probability: 38 },
      { date: 'Feb 15', probability: 40, annotation: 'BJP wins Thiruvananthapuram' },
      { date: 'Mar 1', probability: 42 },
      { date: 'Mar 5', probability: 41 },
      { date: 'Mar 8', probability: 40 },
      { date: 'Mar 13', probability: 42 },
    ],
    keyDrivers: [
      { date: 'Feb 15', driver: 'BJP Wins Thiruvananthapuram Municipal Corp', impact: 'positive', magnitude: 6, description: 'First BJP win in Kerala major municipal body, signals shifting dynamics' },
      { date: 'Mar 1', driver: 'TMC Goes Solo in West Bengal', impact: 'neutral', magnitude: 4, description: 'Mamata Banerjee rejects opposition unity, TMC confident of retaining power' },
      { date: 'Mar 8', driver: 'TVK Party Launch Impact', impact: 'neutral', magnitude: 5, description: 'Actor Vijay\'s TVK party entry adds third front dynamic in Tamil Nadu' },
    ],
  },
  {
    eventId: 'evt-4',
    probabilityHistory: [
      { date: 'Jan 1', probability: 35 },
      { date: 'Jan 15', probability: 38 },
      { date: 'Feb 1', probability: 42 },
      { date: 'Feb 15', probability: 45, annotation: 'Central bank buying continues' },
      { date: 'Mar 1', probability: 50 },
      { date: 'Mar 5', probability: 52 },
      { date: 'Mar 8', probability: 55, annotation: 'Safe-haven demand surges' },
      { date: 'Mar 10', probability: 57 },
      { date: 'Mar 13', probability: 58 },
    ],
    keyDrivers: [
      { date: 'Feb 15', driver: 'China Central Bank Buying', impact: 'positive', magnitude: 7, description: 'PBoC added gold for 16th consecutive month, structural demand floor' },
      { date: 'Mar 1', driver: 'Gold Approaches $5,250', impact: 'positive', magnitude: 6, description: 'Geopolitical premium and inflation hedge demand pushing prices higher' },
      { date: 'Mar 8', driver: 'Safe-Haven Demand Surge', impact: 'positive', magnitude: 8, description: 'West Asia crisis drives massive inflows into gold as risk-off trade intensifies' },
    ],
  },
];

export const getEventHistory = (eventId: string): EventHistory | undefined =>
  EVENT_HISTORIES.find((h) => h.eventId === eventId);
