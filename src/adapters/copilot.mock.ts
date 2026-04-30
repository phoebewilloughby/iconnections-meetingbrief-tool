import type { CopilotAdapter } from './copilot';
import type { PlatformActivity, EventAttendance, Subscription, Connection, HealthScore } from '@/types';
import activityData from '../../data/activity.json';
import eventsData from '../../data/events.json';
import subscriptionsData from '../../data/subscriptions.json';
import connectionsData from '../../data/connections.json';
import healthData from '../../data/health.json';

const activities = activityData as Record<string, PlatformActivity>;
const subscriptions = subscriptionsData as Subscription[];
const connections = connectionsData as Record<string, Connection[]>;
const health = healthData as Record<string, HealthScore>;

interface EventData {
  eventId: string;
  eventName: string;
  date: string;
  attendances: {
    clientId: string;
    attendeesFromFirm: string[];
    meetingsTaken: number;
  }[];
}
const events = eventsData as EventData[];

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const mockCopilot: CopilotAdapter = {
  async getPlatformActivity(clientId, _days) {
    await delay(200 + Math.random() * 200);
    return activities[clientId] ?? {
      clientId,
      windowDays: 90,
      logins: [],
      meetingsRequestedSent: 0,
      meetingsRequestedReceived: 0,
      meetingsConfirmed: 0,
      meetingsAttended: 0,
      searchesPerformed: 0,
      profileViews: 0,
    };
  },

  async listEventsAttended(clientId) {
    await delay(200 + Math.random() * 150);
    const result: EventAttendance[] = [];
    for (const event of events) {
      const attendance = event.attendances.find(a => a.clientId === clientId);
      if (attendance) {
        result.push({
          eventId: event.eventId,
          eventName: event.eventName,
          date: event.date,
          attendeesFromFirm: attendance.attendeesFromFirm,
          meetingsTaken: attendance.meetingsTaken,
        });
      }
    }
    return result;
  },

  async getSubscription(clientId) {
    await delay(150 + Math.random() * 100);
    return subscriptions.find(s => s.clientId === clientId) ?? null;
  },

  async listConnections(clientId) {
    await delay(200 + Math.random() * 150);
    return connections[clientId] ?? [];
  },

  async getHealthScore(clientId) {
    await delay(150 + Math.random() * 100);
    return health[clientId] ?? null;
  },
};
