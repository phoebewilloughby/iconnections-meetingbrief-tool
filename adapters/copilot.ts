import type { PlatformActivity, EventAttendance, Subscription, Connection, HealthScore } from '@/types';

export interface CopilotAdapter {
  getPlatformActivity(clientId: string, days: number): Promise<PlatformActivity>;
  listEventsAttended(clientId: string): Promise<EventAttendance[]>;
  getSubscription(clientId: string): Promise<Subscription | null>;
  listConnections(clientId: string): Promise<Connection[]>;
  getHealthScore(clientId: string): Promise<HealthScore | null>;
}
