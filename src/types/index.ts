export type ISODateString = string;

// CSM
export interface CSM {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarColor: string;
  initials: string;
}

// Firm
export interface Firm {
  id: string;
  name: string;
  type: 'Allocator' | 'Manager';
  subtype: string;
  aum: string;
  aumRaw: number;
  location: string;
  domain: string;
  founded: number;
  employees: number;
  brandColor: string;
  initials: string;
  csmId: string;
  description: string;
  primaryStrategy: string;
  website: string;
}

// Contact
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  companyId: string;
  phone?: string;
}

// Subscription
export interface Subscription {
  clientId: string;
  tier: 'Standard' | 'Premium' | 'Enterprise';
  startDate: ISODateString;
  renewalDate: ISODateString;
  arr: number;
  csmId: string;
  status: 'Active' | 'At Risk' | 'Churned';
}

// Health Score
export interface HealthScore {
  clientId: string;
  score: number;
  band: 'healthy' | 'watch' | 'at-risk';
  reasons: string[];
}

// Gong types
export interface GongParticipant {
  name: string;
  email: string;
  affiliation: 'internal' | 'external';
}

export interface GongCall {
  id: string;
  clientId: string;
  title: string;
  scheduledStart: ISODateString;
  duration: number;
  participants: GongParticipant[];
  aiSummary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
}

export interface GongTranscriptSegment {
  speaker: string;
  startMs: number;
  text: string;
}

export interface GongTranscript {
  callId: string;
  segments: GongTranscriptSegment[];
}

// HubSpot types
export interface HubSpotNote {
  id: string;
  companyId: string;
  authorId: string;
  createdAt: ISODateString;
  type: 'call' | 'email' | 'meeting' | 'general' | 'meeting_prep';
  content: string;
}

// Copilot types
export interface LoginDay {
  date: string;
  count: number;
}

export interface PlatformActivity {
  clientId: string;
  windowDays: number;
  logins: LoginDay[];
  meetingsRequestedSent: number;
  meetingsRequestedReceived: number;
  meetingsConfirmed: number;
  meetingsAttended: number;
  searchesPerformed: number;
  profileViews: number;
}

export interface EventAttendance {
  eventId: string;
  eventName: string;
  date: string;
  attendeesFromFirm: string[];
  meetingsTaken: number;
}

export interface Connection {
  counterpartyId: string;
  counterpartyName: string;
  introducedAt: ISODateString;
  meetingsSinceIntro: number;
}

// News types
export interface NewsItem {
  id: string;
  firmId: string;
  headline: string;
  source: string;
  url: string;
  publishedAt: ISODateString;
  summary: string;
}

// Brief types
export interface TalkingPoint {
  headline: string;
  rationale: string;
  source: {
    type: 'call' | 'note' | 'activity' | 'news' | 'subscription';
    id: string;
    label: string;
  };
}

export interface TouchpointSummary {
  date: ISODateString;
  type: 'call' | 'email' | 'event' | 'meeting';
  bullets: string[];
  openFollowUps: string[];
  sourceCallId?: string;
}

export interface ActivitySummary {
  logins: number;
  meetingsRequested: number;
  meetingsAttended: number;
  profileViews: number;
  loginDelta: string;
  meetingsDelta: string;
  profileViewsDelta: string;
}

export interface BriefOutput {
  clientId: string;
  generatedAt: ISODateString;
  talkingPoints: TalkingPoint[];
  lastTouchpoint: TouchpointSummary;
  platformActivity: ActivitySummary;
  newsItems: string[];
  recentNotes: string[];
}

export interface BriefInput {
  clientId: string;
  meetingDate: Date;
  meetingType?: 'check-in' | 'qbr' | 'kickoff' | 'renewal';
}
